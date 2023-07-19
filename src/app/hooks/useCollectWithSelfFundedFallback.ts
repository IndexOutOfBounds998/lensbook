import {
  AnyPublication,
    Comment,
    FollowOperation,
    Post,
    ProfileOwnedByMe,
    SelfFundedOperation,
    supportsSelfFundedFallback,
    useCollect,
    useSelfFundedFallback,
  } from '@lens-protocol/react-web';
  import { useState } from 'react';
  
  type UseCollectWithSelfFundedFallbackArgs = {
    collector: ProfileOwnedByMe;
    publication: Post | Comment ;
  };
  
  type PossibleError = FollowOperation['error'] | SelfFundedOperation['error'];
  
  export function useCollectWithSelfFundedFallback({
    collector,
    publication,
  }: UseCollectWithSelfFundedFallbackArgs) {
    const [error, setError] = useState<PossibleError>(undefined);
    const gasless = useCollect({ collector, publication });
  
    const selfFunded = useSelfFundedFallback();
  
    const execute = async () => {
     
      const gaslessResult = await gasless.execute();
  
     
      if (gaslessResult.isFailure()) {
    
        if (supportsSelfFundedFallback(gaslessResult.error)) {
          // ask your confirmation before using their funds
          const shouldPayFor = window.confirm(
            'It was not possible to cover the gas costs at this time.\n\n' +
              'Do you wish to continue with your MATIC?',
          );
  
          if (shouldPayFor) {
            // initiate self-funded, will require signature
            const selfFundedResult = await selfFunded.execute(gaslessResult.error.fallback);
  
            if (selfFundedResult.isFailure()) {
              setError(selfFundedResult.error);
            }
          }
          return;
        }
  
        // any other error from
        setError(gaslessResult.error);
      }
    };
  
    return {
      execute,
      error,
      isPending: gasless.isPending || selfFunded.isPending,
    };
  }