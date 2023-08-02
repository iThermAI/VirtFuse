import { useEffect } from 'react';
import axios from 'axios';

function Ws() {

    useEffect(() => {
        axios.get('/node/test')
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });

    }, []);

    return (
        <div className="ws">
            test
        </div>
    )

}

export default Ws;