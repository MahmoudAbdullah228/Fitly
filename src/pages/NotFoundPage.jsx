import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import { Compass, ArrowRight } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-surface-strong flex items-center justify-center text-ink mx-auto">
        <Compass className="w-8 h-8 stroke-[1.8]" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="font-mono text-xs font-bold text-muted uppercase tracking-wider">
          404 Error
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Page Not Found
        </h1>
        <p className="text-sm text-body leading-relaxed">
          The page or job listing you are looking for does not exist or has been moved.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link to="/">
          <Button variant="secondary">Back to Homepage</Button>
        </Link>
        <Link to="/matches">
          <Button variant="primary">
            <span>View Job Matches</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
