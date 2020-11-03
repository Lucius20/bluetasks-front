import axios from 'axios';
import { useContext, useState } from 'react';
import { API_ENDPOINT } from '../constants';
import { AuthContext } from './useAuth';

export function useTasks() {
    const auth = useContext(AuthContext);
    const [ taskList, setTaskList ] = useState([]);
    const [ error, setError ] = useState(null);
    const [ processing, setProcessing ] = useState(false);
    const [ taskDeleted, setTaskDeleted ] = useState(null);
    const [ taskUpdated, setTaskUpdated ] = useState(null);
    const [ taskLoaded, setTaskLoaded ] = useState(null);

    async function list() {
        try {
            setProcessing(true);
            setError(null);

            const response = await axios.get(`${API_ENDPOINT}/tasks?sort=whenToDo,asc`, buildAuthHeader())
            const content = response.data.content;

            if (content.length === 1 && content[0].value && content[0].value.length === 0) {
                setTaskList([]);
            } else {
                setTaskList(content);
            }

            setProcessing(false);
        
        } catch (error) {
            handleError(error);
        }
    }

    async function deleteTask(taskToDelete) {
        try {
            await axios.delete(`${API_ENDPOINT}/tasks/${taskToDelete.id}`, buildAuthHeader());
            setTaskList(taskList.filter(task => taskToDelete.id !== task.id));
            setTaskDeleted(taskToDelete);
        } catch(error) {
            handleError(error);
        }
    }

    function clearTaskDeleted() {
        setTaskDeleted(null);
    }

    function clearTaskUpdated() {
        setTaskUpdated(null);
    }

    function clearTaskLoaded() {
        setTaskLoaded(null);
    }

    async function load(id) {
        try {
            setProcessing(true);
            setError(null);
            setTaskLoaded(null);

            const response = await axios.get(`${API_ENDPOINT}/tasks/${id}`, buildAuthHeader())
            setTaskLoaded(response.data);
            setProcessing(false);
        
        } catch (error) {
            handleError(error);
        }
    }

    async function save(taskToSave, onlyStatus = false) {
        try {
            setProcessing(!onlyStatus);
            setTaskUpdated(null);
            setError(null);

            if (taskToSave.id === 0) {
                await axios.post(`${API_ENDPOINT}/tasks`, taskToSave, buildAuthHeader());
            
            } else {
                await axios.put(`${API_ENDPOINT}/tasks/${taskToSave.id}`, taskToSave, buildAuthHeader());
            }
            
            setProcessing(false);
            setTaskUpdated(taskToSave);

        } catch (error) {
            handleError(error);
        }
    }

    function handleError(error) {
        console.error(error);
        const resp = error.response;

        if (resp && resp.status === 400 && resp.data) {
            setError(resp.data.error);
        } else {
            setError(error.message);
        }

        setProcessing(false);
    }

    function buildAuthHeader() {
        return {
            headers: {
                'authorization': `Bearer ${auth.credentials.token}`
            }
        }
    }

    return { taskList, error, processing, taskDeleted, taskUpdated, taskLoaded, list, load, save, deleteTask, clearTaskDeleted, clearTaskUpdated, clearTaskLoaded };

}