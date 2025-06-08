// components/withAuth.tsx
import { useEffect, useState, JSX } from 'react';
import { useRouter } from 'next/navigation';
import { useZustandStore } from '../store/store';

export function withAuth<P>(WrappedComponent: React.ComponentType<P>) {
  const Wrapper = (props: P): JSX.Element | null => {
    const [verified, setVerified] = useState(false);
    const router = useRouter();
    const { isSignedIn, isHydrated } = useZustandStore();

    useEffect(() => {
      if (isHydrated) {
        if (!isSignedIn) {
          router.replace('/login');
        } else {
          setVerified(true);
        }
      }
    }, [isSignedIn, isHydrated, router]);

    if (!isHydrated) {
      return null; // Or a loading spinner while the store is hydrating
    }

    if (!verified) {
      return null; // Or a loading spinner while verifying auth status
    }

    return <WrappedComponent {...(props as P & JSX.IntrinsicAttributes)} />;
  };

  return Wrapper;
}