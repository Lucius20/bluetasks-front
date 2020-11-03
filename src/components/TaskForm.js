/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import Alert from './Alert';

function TaskForm(props) {
    const auth = useContext(AuthContext);
    const tasks = useTasks();
    const [ redirect, setRedirect ] = useState(false);
    const [ task, setTask ] = useState({ id: 0, description: "", whenToDo: "", done: false });

    useEffect(() => {
        const editId = props.match.params.id;

        if (editId && auth.credentials.username !== null) {
            tasks.load(~~editId);
        }
    }, [ auth.credentials ]);

    useEffect(() => {
        if (tasks.taskLoaded) {
            setTask(tasks.taskLoaded)
            tasks.clearTaskLoaded();
        }
    }, [ tasks.taskLoaded ]);

    function onSubmitHandler(event) {
        event.preventDefault();
        tasks.save(task);
    }

    function onInputChangeHandler(event) {
        const field = event.target.name;
        const value = event.target.value;

        setTask({ ...task, [field]: value });
    }
    
    if (!auth.isAuthenticated()) {
        return <Redirect to="/login" />;
    }

    if (redirect || tasks.taskUpdated) {
        return <Redirect to="/tasks" />
    }

    return (
        <div>
            {task.id !== 0 ? <h1>Edição de Tarefa</h1> : <h1>Cadastro de Tarefa</h1>}
            {tasks.error && <Alert message={tasks.error} />}
            <form onSubmit={onSubmitHandler}>
                <div className="form-group">
                    <label htmlFor="description">Descrição</label>
                    <input type="text" className="form-control" name="description" value={task.description} placeholder="Digite a descrição..." onChange={onInputChangeHandler}/>
                </div>
                <div className="form-group">
                    <label htmlFor="whenToDo">Data</label>
                    <input type="date" className="form-control" name="whenToDo" value={task.whenToDo} placeholder="Informe a data..."  onChange={onInputChangeHandler}/>
                </div>
                <button 
                    type="submit"
                    className="btn btn-primary"
                    disabled={tasks.processing}>
                        {tasks.processing ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> : task.id === 0 ? "Gravar" : "Alterar"}
                        
                </button>
                &nbsp;&nbsp;
                <button type="button" className="btn btn-primary" onClick={() => setRedirect(true)}>Cancelar</button>
            </form>
        </div>
    );
}

export default TaskForm;