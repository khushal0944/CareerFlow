import { useState } from "react";
import { toast } from "sonner";

const useFetch = (cb: any) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const fn = async (...args: any[]) => {
		setLoading(true);
		setError(null);
		try {
			const result = await cb(...args);
			setData(result);
			setError(null);
		} catch (error: any) {
			setError(error);
			console.error(error?.message);
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};
	return { data, loading, error, fn, setData };
};

export default useFetch;