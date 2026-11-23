import json
import re
import sys
from calendar import timegm
from datetime import datetime, timedelta, timezone

import feedparser
import requests

TIMEOUT = 15
HEADERS = {'User-Agent': 'Mozilla/5.0 (compatible; job-search/1.0)'}

# Words that appear in almost every tech job title, so they say little about a match.
GENERIC_WORDS = {
    'engineer', 'engineering', 'developer', 'dev', 'specialist', 'expert',
    'senior', 'junior', 'lead', 'and', 'the', 'for', 'of',
}

# Other names a job post may use for a requested location.
LOCATION_ALIASES = {
    'uae': ['uae', 'united arab emirates', 'dubai', 'abu dhabi'],
    'usa': ['usa', 'united states', 'us only', 'u.s.'],
    'uk': ['uk', 'united kingdom', 'england', 'london'],
    'pakistan': ['pakistan', 'lahore', 'karachi', 'islamabad'],
}


def contains_word(text, word):
    return re.search(rf'(?<!\w){re.escape(word)}(?!\w)', text) is not None


def match_query(text, query):
    """True if the text has every meaningful word of the query.

    Text in brackets is ignored, and "/" separates alternatives:
    "NLP / LLM Engineer" matches a title with either NLP or LLM.
    """
    text = (text or '').lower()
    query = re.sub(r'\([^)]*\)', ' ', query.lower())

    for alternative in query.split('/'):
        words = re.findall(r'[\w+#.]+', alternative)
        specific = [word for word in words if word not in GENERIC_WORDS]
        wanted = specific or words
        if wanted and all(contains_word(text, word) for word in wanted):
            return True
    return False


def score(title, tags, query):
    """2 for a title match, 1 for a match on the tags only, 0 for neither."""
    if match_query(title, query):
        return 2
    if match_query(f'{title} {tags}', query):
        return 1
    return 0


def match_location(job_location, requested, is_remote):
    requested = requested.lower()
    job_location = (job_location or '').lower()

    if 'remote' in requested or 'worldwide' in requested:
        return is_remote
    if is_remote and (not job_location or job_location == 'remote'):
        return True
    if any(contains_word(job_location, word) for word in ('worldwide', 'anywhere')):
        return True
    names = LOCATION_ALIASES.get(requested, [requested])
    return any(contains_word(job_location, name) for name in names)


def to_datetime(value):
    """Reads ISO dates and Unix timestamps. Returns None if the date is unknown."""
    if value in (None, ''):
        return None
    try:
        if isinstance(value, (int, float)):
            return datetime.fromtimestamp(value, timezone.utc)
        parsed = datetime.fromisoformat(str(value).replace('Z', '+00:00'))
        return parsed if parsed.tzinfo else parsed.replace(tzinfo=timezone.utc)
    except (ValueError, OverflowError, OSError):
        return None


def get_json(url, **kwargs):
    response = requests.get(url, headers=HEADERS, timeout=TIMEOUT, **kwargs)
    response.raise_for_status()
    return response.json()


def fix_encoding(text):
    """RemoteOK encodes accented letters twice, which turns them into two characters."""
    try:
        return (text or '').encode('latin-1').decode('utf-8')
    except UnicodeError:
        return text


def get_remoteok_jobs():
    for item in get_json('https://remoteok.com/api')[1:]:
        yield {
            'title': fix_encoding(item.get('position', '')),
            'company': fix_encoding(item.get('company', '')),
            'location': fix_encoding(item.get('location')) or 'Remote',
            'link': item.get('url'),
            'posted': to_datetime(item.get('date')),
            'source': 'RemoteOK',
            'skills': ', '.join(item.get('tags') or []),
            'remote': True,
        }


def get_wwr_jobs():
    for category in ('remote-programming-jobs', 'remote-devops-sysadmin-jobs', 'remote-product-jobs'):
        response = requests.get(
            f'https://weworkremotely.com/categories/{category}.rss', headers=HEADERS, timeout=TIMEOUT)
        response.raise_for_status()
        for entry in feedparser.parse(response.content).entries:
            company, separator, position = entry.title.partition(':')
            published = entry.get('published_parsed')
            yield {
                'title': position.strip() if separator else entry.title,
                'company': company.strip() if separator else 'Unknown',
                'location': entry.get('region') or 'Remote',
                'link': entry.link,
                'posted': to_datetime(timegm(published)) if published else None,
                'source': 'WeWorkRemotely',
                'skills': '',
                'remote': True,
            }


def get_arbeitnow_jobs():
    for item in get_json('https://www.arbeitnow.com/api/job-board-api').get('data', []):
        yield {
            'title': item.get('title', ''),
            'company': item.get('company_name', ''),
            'location': item.get('location', ''),
            'link': item.get('url'),
            'posted': to_datetime(item.get('created_at')),
            'source': 'Arbeitnow',
            'skills': ', '.join(item.get('tags') or []),
            'remote': bool(item.get('remote')),
        }


def get_hn_jobs():
    since = int((datetime.now(timezone.utc) - timedelta(days=30)).timestamp())
    data = get_json('https://hn.algolia.com/api/v1/search_by_date', params={
        'tags': 'job',
        'numericFilters': f'created_at_i>{since}',
        'hitsPerPage': 200,
    })
    for item in data.get('hits', []):
        title = item.get('title') or ''
        company = re.split(r'\s+is\s+hiring\b|\s+\(YC', title, flags=re.IGNORECASE)[0]
        yield {
            'title': title,
            'company': company if company != title else 'HN Post',
            'location': 'See post',
            'link': item.get('url') or f"https://news.ycombinator.com/item?id={item.get('objectID')}",
            'posted': to_datetime(item.get('created_at')),
            'source': 'Hacker News',
            'skills': '',
            'remote': 'remote' in title.lower(),
        }


SOURCES = (get_remoteok_jobs, get_wwr_jobs, get_arbeitnow_jobs, get_hn_jobs)


def search(query, location='Remote', limit=100, max_age_hours=None):
    cutoff = None
    if max_age_hours:
        cutoff = datetime.now(timezone.utc) - timedelta(hours=max_age_hours)

    found = {}
    failed = 0
    for source in SOURCES:
        # One source being down must not lose the results of the others.
        try:
            for job in source():
                rank = score(job['title'], job['skills'], query)
                if not rank or not job['link']:
                    continue
                if not match_location(job['location'], location, job['remote']):
                    continue
                if cutoff and job['posted'] and job['posted'] < cutoff:
                    continue
                found.setdefault(job['link'], (rank, job))
        except Exception as err:
            failed += 1
            print(f'{source.__name__} failed: {err}', file=sys.stderr)

    if failed == len(SOURCES):
        raise RuntimeError('No job board could be reached')

    oldest = datetime.min.replace(tzinfo=timezone.utc)
    ranked = sorted(found.values(), key=lambda item: (item[0], item[1]['posted'] or oldest), reverse=True)

    results = []
    for _, job in ranked[:limit]:
        posted = job.pop('posted')
        job.pop('remote')
        job['date'] = posted.strftime('%d %b %Y') if posted else 'Date not given'
        results.append(job)
    return results


def main():
    try:
        args = json.loads(sys.argv[1])
        print(json.dumps(search(
            args['query'],
            args.get('location') or 'Remote',
            int(args.get('limit') or 100),
            args.get('maxAgeHours'),
        )))
    except Exception as err:
        print(json.dumps({'error': str(err)}))
        sys.exit(1)


if __name__ == '__main__':
    main()
