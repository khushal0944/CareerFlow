import React, { ReactNode, Suspense } from 'react'
import {BarLoader} from 'react-spinners'

const layout = ({children}: {children: ReactNode}) => {
	return (
		<div className='px-5'>
			<div className='flex justify-between items-center mb-5'>
                <h1 className='text-6xl gradient-title font-bold'>
                    Industry Insights
                </h1>
            </div>
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