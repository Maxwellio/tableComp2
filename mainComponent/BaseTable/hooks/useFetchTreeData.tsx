import { useCallback, useEffect, useState } from 'react';
import { useApi } from '../../services/api';

export const useFetchData = <T,> (url:String, id:Number) => {
    const api = useApi(); //обязательно использовать <AxiosProvider>
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
 
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const reqApi = `${url}/${id}`;
                const data = (await api.get(reqApi)).data;
                setData(Array.of(data));
                setError(null);
            } catch(err){
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const fetchChildren = useCallback(async (parentId,) => {
        const reqApi = `${url}/${parentId}/children`;
        const children = (await api.get(reqApi)).data;
        setData(prev => {
            const updateNode = (nodes) =>{
                return nodes.map(node => {         
                    if (node.id  === parentId && !node.hasLoaded){
                        return {...node, children: children, hasLoaded: true};
                    }
                    if (node.children) {
                        return {...node, children: updateNode(node.children), hasLoaded: true}
                    }
                    return node;
                })
            }
            return updateNode(prev);
        })        
        
    }, [])

    return {
        data,
        loading,
        setData,
        fetchChildren
    }
};


