import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap text-center">
      <h1 className="font-headline-xl text-headline-xl text-on-surface mb-4">404 - Page Not Found</h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-label-lg text-label-lg hover:bg-primary-container transition-colors shadow-sm"
      >
        Return Home
      </Link>
    </div>
  );
}
