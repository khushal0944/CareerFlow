import React, { ReactNode, Suspense } from 'react'
import {BarLoader} from 'react-spinners'

const layout = ({children}: {children: ReactNode}) => {
    return (
        <div className='px-5'>
            <Suspense
                fallback={
                    <BarLoader className="mt-4 mx-auto" width={"80%"} color="gray" />
                }
            >
                {children}
            </Suspense>
        </div>
    );
};

export default layout