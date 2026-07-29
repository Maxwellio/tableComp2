import { useCallback, useEffect, useState } from 'react';
import { useApi } from '../../services/api';

export type TreeLoadMode = 'lazy' | 'full';

export const useFetchData = <T,> (url: string, id: Number, loadMode: TreeLoadMode = 'lazy') => {
    const api = useApi(); //обязательно использовать <AxiosProvider>
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
 
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Full endpoint уже возвращает ACL-корни с потомками, поэтому второй запрос не нужен.
                if (loadMode === 'full') {
                    const data = (await api.get(url)).data;
                    setData(data);
                } else {
                    const reqApi = `${url}/${id}`;
                    const data = (await api.get(reqApi)).data;
                    setData(Array.of(data));
                }
                setError(null);
            } catch(err){
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [api, id, loadMode, url]);

    const fetchChildren = useCallback(async (parentId,) => {
        // Защита контракта full-режима: вложенные узлы уже пришли первым GET.
        if (loadMode === 'full') {
            return;
        }

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
        
    }, [api, loadMode, url])

    return {
        data,
        loading,
        setData,
        fetchChildren
    }
};


