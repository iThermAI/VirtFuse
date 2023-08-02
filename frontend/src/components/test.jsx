import { useState } from 'react';
import axios from "axios";

function Test() {

    const [retData, setRetData] = useState({});
    const [imgsrc, setImgsrc] = useState(null);

    const jsonHandler = async () => {
        await axios.get("/node/getSensorInfo").then((res) => {
            console.log(res);
            setRetData(res.data);
            console.log(retData);
        }).catch((err) => {
            console.log(err);
        });
    }

    const imageHandler = async () => {
        await axios.get("/node/getVideoInfo", { responseType: 'arraybuffer' })
            .then((response) => {
                console.log(response);
                const blob = new Blob([response.data], { type: 'image/jpeg' });
                const reader = new FileReader();
                reader.onload = () => {
                    setImgsrc(reader.result);
                };
                reader.readAsDataURL(blob);
            }).catch((err) => {
                console.log(err);
            });
    }

    return (
        <>
            <button onClick={jsonHandler}>get json value</button>
            <ul>
                {Object.entries(retData).map(([key, value]) => (
                    <li key={key}>
                        <strong>{key}:</strong> {value}
                    </li>
                ))}
            </ul>

            <button onClick={imageHandler}>get image</button>
            <img alt="Sample" src={imgsrc} />
        </>
    );
}

export default Test;