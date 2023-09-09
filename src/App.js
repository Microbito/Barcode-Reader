import {  useRef, useState } from 'react';
import { BarcodeDetector } from "barcode-detector/pure";


function App() {

  var video = useRef(null);
  var canvas = useRef(null);
  const [barcode, setBarcode] = useState(null);

  const readCode = () => {
    navigator.mediaDevices.getUserMedia({video:{width: 800, height:600}})
      .then(stream => {
        video.current.srcObject = stream;
        video.current.play()
          .catch(err => console.log(err));

        const ctx = canvas.current.getContext("2d");
        const barcode = new BarcodeDetector({formats:["qr_code", "ean_13"]});

        setInterval(() => {
          
          canvas.current.width = video.current.videoWidth;
          canvas.current.height = video.current.videoHeight;

          ctx.drawImage(video.current, 0, 0, video.current.videoWidth, video.current.videoHeight);
          barcode.detect(canvas.current)
            .then(([data]) => {
              if (data)
                setBarcode(data.rawValue);
                //console.log(data);
            })
            .catch(err => console.log(err));

        }, 100);
      })
      .catch(err => console.log(err));
  };

  return (
    <>
      <button onClick={readCode}>Leer código</button>
     <div> 
        <video ref={video} autoPlay muted hidden />
        <canvas ref={canvas}/>
      </div>
      <div>
        {barcode}
      </div>
    </>
  );
}

export default App;