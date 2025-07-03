import React from 'react';
import { BuildingStorefrontIcon } from '../components/icons';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center bg-white rounded-lg shadow-sm p-12">
      <BuildingStorefrontIcon className="h-16 w-16 text-blue-300" />
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-6 text-base leading-7 text-slate-600">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <div className="mt-10">
        <a
          href="#"
          onClick={() => window.location.reload()} // Simple way to go back to the dashboard
          className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Go back home
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
