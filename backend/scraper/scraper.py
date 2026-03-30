import requests
import json
import sys
import feedparser
import re
from datetime import datetime, timedelta

def match_query(text, query):
    """Checks if query keywords match in text (case-insensitive)."""
    if not text or not query:
        return False
    text = text.lower()
    query = query.lower()
    # Remove special characters like () /
    query = re.sub(r'[()\/]', ' ', query)
    keywords = [k.strip() for k in query.split() if len(k.strip()) > 2]
    if not keywords: # fallback to exact match if query is very short
        return query in text
    # Require at least one main keyword to match
    return any(keyword in text for keyword in keywords)

def get_remoteok_jobs(query, location="Remote", limit=100):
    url = "https://remoteok.com/api"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    jobs = []
    try:
        response = requests.get(url, headers=headers, timeout=15)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 1:
                for item in data[1:]:
                    if len(jobs) >= limit:
                        break
                    
                    title = item.get('position', '')
                    company = item.get('company', '')
                    tags = ", ".join(item.get('tags', []))
                    job_loc = (item.get('location') or "Remote").lower()
                    
                    l_lower = location.lower()
                    
                    # Search query in title, company or tags
                    query_match = match_query(f"{title} {company} {tags}", query)
                    
                    # Location match
                    location_match = "remote" in l_lower or "worldwide" in l_lower or l_lower in job_loc or "remote" in job_loc
                    
                    if query_match and location_match:
                        jobs.append({
                            "title": title,
                            "company": company,
                            "location": item.get('location') or "Remote",
                            "link": item.get('url'),
                            "date": item.get('date'),
                            "source": "RemoteOK",
                            "skills": tags
                        })
    except Exception as e:
        print(f"Error fetching from RemoteOK: {e}", file=sys.stderr)
    return jobs

def get_wwr_jobs(query, location="Remote", limit=100):
    categories = ['remote-programming-jobs', 'remote-devops-sysadmin-jobs', 'remote-product-jobs']
    jobs = []
    l_lower = location.lower()
    
    for cat in categories:
        url = f"https://weworkremotely.com/categories/{cat}.rss"
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries:
                if len(jobs) >= limit:
                    break
                
                title = entry.title
                summary = entry.summary
                
                parts = title.split(':')
                company = parts[0].strip() if len(parts) > 1 else "Unknown"
                position = parts[1].strip() if len(parts) > 1 else title
                
                query_match = match_query(f"{position} {company} {summary}", query)
                location_match = "remote" in l_lower or "worldwide" in l_lower or l_lower in title.lower() or l_lower in summary.lower()
                
                if query_match and location_match:
                    jobs.append({
                        "title": position,
                        "company": company,
                        "location": "Remote",
                        "link": entry.link,
                        "date": entry.published if hasattr(entry, 'published') else "",
                        "source": "WeWorkRemotely",
                        "skills": ""
                    })
        except Exception as e:
            print(f"Error fetching from WWR category {cat}: {e}", file=sys.stderr)
            
    return jobs

def get_themuse_jobs(query, location="Remote", limit=100):
    # Public API: https://www.themuse.com/api/public/jobs
    # Example: https://www.themuse.com/api/public/jobs?page=1&category=Software%20Engineering
    jobs = []
    try:
        # Clean query for API
        clean_q = re.sub(r'[()\/]', ' ', query).strip()
        url = f"https://www.themuse.com/api/public/jobs?page=1&category=Software%20Engineering"
        # The Muse allows location filtering but we'll do it manually to be more flexible
        response = requests.get(url, timeout=15)
        if response.status_code == 200:
            data = response.json()
            for item in data.get('results', []):
                if len(jobs) >= limit:
                    break
                
                title = item.get('name', '')
                company = item.get('company', {}).get('name', 'Unknown')
                job_locations = ", ".join([l.get('name', '') for l in item.get('locations', [])])
                
                query_match = match_query(f"{title} {company}", query)
                l_lower = location.lower()
                location_match = "remote" in l_lower or "worldwide" in l_lower or l_lower in job_locations.lower() or "remote" in job_locations.lower()
                
                if query_match and location_match:
                    jobs.append({
                        "title": title,
                        "company": company,
                        "location": job_locations or "Remote",
                        "link": item.get('refs', {}).get('landing_page', ''),
                        "date": item.get('publication_date', ''),
                        "source": "The Muse",
                        "skills": ""
                    })
    except Exception as e:
        print(f"Error fetching from The Muse: {e}", file=sys.stderr)
    return jobs

def get_arbeitnow_jobs(query, location="Remote", limit=100):
    url = "https://www.arbeitnow.com/api/job-board-api"
    jobs = []
    try:
        response = requests.get(url, timeout=15)
        if response.status_code == 200:
            data = response.json()
            for item in data.get('data', []):
                if len(jobs) >= limit:
                    break
                
                title = item.get('job_title', '')
                company = item.get('company_name', '')
                job_loc = item.get('location', '')
                
                query_match = match_query(f"{title} {company}", query)
                l_lower = location.lower()
                
                is_remote = item.get('remote')
                remote_str = str(is_remote).lower() if is_remote is not None else ""
                
                location_match = "remote" in l_lower or "worldwide" in l_lower or l_lower in job_loc.lower() or "remote" in remote_str
                
                if query_match and location_match:
                    jobs.append({
                        "title": title,
                        "company": company,
                        "location": job_loc,
                        "link": item.get('url'),
                        "date": "Recently",
                        "source": "Arbeitnow",
                        "skills": ", ".join(item.get('tags', []))
                    })
    except Exception as e:
        print(f"Error fetching from Arbeitnow: {e}", file=sys.stderr)
    return jobs

def get_hn_jobs(query, location="Remote", limit=100):
    # Algolia API for Hacker News: https://hn.algolia.com/api
    # Searching for "Who is hiring" posts or specific job posts
    jobs = []
    try:
        # Search for jobs in the last 30 days
        timestamp = int((datetime.now() - timedelta(days=30)).timestamp())
        url = f"https://hn.algolia.com/api/v1/search_by_date?query={query}&tags=story&numericFilters=created_at_i>{timestamp}"
        response = requests.get(url, timeout=15)
        if response.status_code == 200:
            data = response.json()
            for item in data.get('hits', []):
                if len(jobs) >= limit:
                    break
                
                title = item.get('title', '')
                url = item.get('url')
                if not url:
                    url = f"https://news.ycombinator.com/item?id={item.get('objectID')}"
                
                # HN titles are often "Company (YC W22) is hiring a Backend Engineer"
                company = "HN Post"
                if " is hiring " in title:
                    company = title.split(" is hiring ")[0]
                
                query_match = match_query(title, query)
                l_lower = location.lower()
                # HN jobs are often remote or specific to US/Europe, but we'll assume remote-friendly for tech posts
                location_match = "remote" in l_lower or "worldwide" in l_lower or l_lower in title.lower() or "remote" in title.lower()
                
                if query_match and location_match:
                    jobs.append({
                        "title": title,
                        "company": company,
                        "location": "Remote / See Post",
                        "link": url,
                        "date": item.get('created_at', ''),
                        "source": "Hacker News",
                        "skills": ""
                    })
    except Exception as e:
        print(f"Error fetching from Hacker News: {e}", file=sys.stderr)
    return jobs

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No query provided"}))
        return

    try:
        # Try parsing as JSON first
        try:
            args = json.loads(sys.argv[1])
            query = args.get("query", "AI Engineer")
            location = args.get("location", "Remote")
            limit = int(args.get("limit", 100))
        except (json.JSONDecodeError, ValueError):
            # Fallback to positional arguments
            query = sys.argv[1] if len(sys.argv) > 1 else "AI Engineer"
            location = sys.argv[2] if len(sys.argv) > 2 else "Remote"
            limit = int(sys.argv[3]) if len(sys.argv) > 3 and sys.argv[3].isdigit() else 100
        
        all_jobs = []
        
        # Fetch from sources
        all_jobs.extend(get_remoteok_jobs(query, location, limit))
        all_jobs.extend(get_wwr_jobs(query, location, limit))
        all_jobs.extend(get_themuse_jobs(query, location, limit))
        all_jobs.extend(get_arbeitnow_jobs(query, location, limit))
        all_jobs.extend(get_hn_jobs(query, location, limit))
        
        # Deduplicate jobs by link
        seen_links = set()
        unique_jobs = []
        for job in all_jobs:
            if job['link'] not in seen_links:
                seen_links.add(job['link'])
                unique_jobs.append(job)
        
        # Final filtering and sorting
        unique_jobs = unique_jobs[:limit]
        
        print(json.dumps(unique_jobs))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
