import React, { ReactNode } from 'react'

const layout = ({children}: {children: ReactNode}) => {
  return (
		<div className="container mt-24 mb-20 mx-auto">
			{children}
		</div>
  );
}

export default layout