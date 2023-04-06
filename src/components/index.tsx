import { RefObject, useCallback, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Divider } from "@mui/material";
import Webcam from "react-webcam";
// import {PermissionDescriptor} from '@types/permissions-api';

interface PhotoModalProps {
  handleClose: () => void;
  open: boolean;
  changePhotoNewVisitant: (photo: any) => void;
}

export default function PhotoModal() {
  const [image, setImage] = useState<any>(null);
  const webcamRef = useRef<Webcam>(null);

  function takeSnapshot(webcamRef: RefObject<Webcam>) {
    const imageSrc = webcamRef.current?.getScreenshot();
    // Use a imagem capturada como desejar
    console.log(imageSrc);
    setImage(imageSrc);
    if (!image && webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc);

      changePhotoNewVisitant(imageSrc);
    } else {
      setImage(null);
    }
  }

  const handleClearCapture = () => {
    handleClose();
    setImage(null);
  };

  const FACING_MODE_USER = "user";
  const FACING_MODE_ENVIRONMENT = "environment";

  const videoConstraints = {
    facingMode: FACING_MODE_USER,
  };

  const [facingMode, setFacingMode] = useState(FACING_MODE_USER);

  const handleSwapCamera = useCallback(() => {
    setFacingMode((prevState) =>
      prevState === FACING_MODE_USER
        ? FACING_MODE_ENVIRONMENT
        : FACING_MODE_USER
    );
  }, []);

  const isDisabled = !image;

  return (
    <Dialog open={open} onClose={handleClearCapture} fullWidth maxWidth="md">
      <DialogTitle sx={{ textAlign: "center" }}>Câmera</DialogTitle>
      <Divider />
      <DialogContent>
        {!image ? (
          <Webcam
            height={400}
            width={400}
            audio={false}
            style={{
              width: "100%",
            }}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              ...videoConstraints,
              facingMode,
              // facingMode: 'environment',
            }}
            mirrored
          />
        ) : (
          <img src={image} />
        )}
      </DialogContent>
      <DialogActions
        sx={{
          padding: "0px 25px 25px 0px",
        }}
      >
        <Button onClick={handleSwapCamera} variant="outlined">
          Mudar de Camera
        </Button>
        <Button onClick={() => takeSnapshot(webcamRef)} variant="outlined">
          {image ? "Tirar outra foto" : "Capturar"}
        </Button>
        <Button
          onClick={handleClearCapture}
          variant="contained"
          disabled={isDisabled}
        >
          Usar foto
        </Button>
      </DialogActions>
    </Dialog>
  );
}
function handleClose() {
  throw new Error("Function not implemented.");
}

function changePhotoNewVisitant(imageSrc: string | null) {
  throw new Error("Function not implemented.");
}

