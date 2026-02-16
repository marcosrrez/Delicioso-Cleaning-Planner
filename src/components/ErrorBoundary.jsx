import React from 'react';
import { RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-brand-cream p-6">
          <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-50 rounded-2xl flex items-center justify-center text-red-400 text-3xl">
              !
            </div>
            <h2 className="text-xl font-bold text-slate-800">Something went wrong</h2>
            <p className="text-sm text-slate-500">
              Don't worry — your data is safe in local storage. Try refreshing the page.
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 bg-brand-accent text-white px-6 py-3 rounded-full font-bold hover:scale-105 active:scale-95 transition-transform"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
