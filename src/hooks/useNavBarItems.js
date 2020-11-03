import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./useAuth";

export function useNavBarItems() {
    const auth = useContext(AuthContext);
    const [ items, setItems ] = useState([]);
    const [ helloMessage, setHelloMessage ] = useState(null);

    useEffect(() => {
        const activate = (clickedItem) => {
            if (!clickedItem) {
                setItems(items.map(item => item.name === clickedItem.name ? { ...item, active: true } : { ...item, active: false }));
            }

        }

        const items = [
            { name: "Listar Tarefas", href: "/tasks", active: true, onClick: activate },
            { name: "Nova Tarefa", href: "/form", active: false, onClick: activate }
        ];

        if (auth.isAuthenticated()) {
            items.push({ name: "Logout", href: "#", active: false, onClick: () => {auth.logout(); setHelloMessage(null)}});
            setHelloMessage(`Olá, ${auth.credentials.displayName}!`);
        }

        setItems(items);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ auth.credentials ]);

    return { items, helloMessage };
}