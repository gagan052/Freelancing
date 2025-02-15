from typing import List, Dict
import json
from datetime import datetime

class SearchService:
    def __init__(self):
        self.jobs_index = {}
        self.freelancers_index = {}
        self.load_data()

    def load_data(self):
        # Load sample data (replace with database in production)
        self.jobs = [
            {
                "id": "1",
                "title": "Frontend Developer",
                "skills": ["React", "TypeScript", "Accessibility"],
                "type": "Remote",
                "posted": datetime.now().isoformat(),
                "salary": "$60-80k"
            },
            # Add more jobs...
        ]
        
        self.freelancers = [
            {
                "id": "1",
                "name": "David Chen",
                "skills": ["Python", "Machine Learning", "Voice UI"],
                "rating": 4.9,
                "hourly_rate": "$65"
            },
            # Add more freelancers...
        ]

        # Index the data
        self._build_index()

    def _build_index(self):
        # Build search index for jobs
        for job in self.jobs:
            terms = (
                job["title"].lower().split() + 
                job["skills"] + 
                [job["type"].lower()]
            )
            for term in terms:
                if term not in self.jobs_index:
                    self.jobs_index[term] = []
                self.jobs_index[term].append(job["id"])

        # Build search index for freelancers
        for freelancer in self.freelancers:
            terms = (
                freelancer["name"].lower().split() + 
                freelancer["skills"]
            )
            for term in terms:
                if term not in self.freelancers_index:
                    self.freelancers_index[term] = []
                self.freelancers_index[term].append(freelancer["id"])

    def search(self, query: str, category: str = "all") -> Dict[str, List]:
        query_terms = query.lower().split()
        results = {"jobs": [], "freelancers": []}

        if category in ["all", "jobs"]:
            job_ids = set()
            for term in query_terms:
                job_ids.update(self.jobs_index.get(term, []))
            results["jobs"] = [job for job in self.jobs if job["id"] in job_ids]

        if category in ["all", "freelancers"]:
            freelancer_ids = set()
            for term in query_terms:
                freelancer_ids.update(self.freelancers_index.get(term, []))
            results["freelancers"] = [f for f in self.freelancers if f["id"] in freelancer_ids]

        return results 