import React, { useState } from 'react';
import { ImageConfig } from '../common/character';
import { ModalControl } from './modal';
import i18next from 'i18next';
import { Buffer } from 'buffer';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Pica from 'pica';
import { STAMarkdown } from './staMarkdown';

const pica = Pica();

enum ImageType {
  Token,
  Image,
}

interface IFileUploadViewProperties {
  onTokenSelected: () => void;
  onImageSelected: (config: ImageConfig) => void;
}

export const FileUploadView: React.FC<IFileUploadViewProperties> = ({
  onTokenSelected,
  onImageSelected,
}) => {
  const [fileContents, setFileContents] = useState<string | undefined>(
    undefined,
  );
  const [fileContentType, setFileContentType] = useState<string | undefined>(
    undefined,
  );
  const [imageType, setImageType] = useState<ImageType>(ImageType.Token);

  const { t } = useTranslation();

  const onFileChange = (event) => {
    const file = event.target.files[0];
    readFileContent(file);
  };

  const readFileContent = async (file: File) => {
    let originalSize = 450;
    const targetSize = 450;

    const img = new Image();
    img.onload = async () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      originalSize = Math.min(width, height);

      const value = await clipAndResizeImage(
        img,
        0,
        0,
        originalSize,
        originalSize,
        targetSize,
        targetSize,
        file.type,
      );
      const buffer = await value.arrayBuffer();

      const base64 = Buffer.from(buffer).toString('base64');

      setFileContents(base64);
      setFileContentType('image/jpeg');

      return true;
    };
    img.src = URL.createObjectURL(file);
  };

  const fileData = () => {
    if (fileContentType) {
      return (
        <div className="text-center my-3">
          <img
            className="mw-100"
            src={'data:' + fileContentType + ';base64,' + fileContents}
            id="file-upload-image-view"
            style={{
              width: '250px',
              aspectRatio: '1',
            }}
          />
        </div>
      );
    } else {
      return undefined;
    }
  };

  const processImage = () => {
    if (imageType === ImageType.Token) {
      onTokenSelected();
    } else {
      onImageSelected(new ImageConfig(fileContentType, fileContents));
    }
    ModalControl.hide();
  };

  async function clipAndResizeImage(
    sourceImage: HTMLImageElement,
    cropX: number,
    cropY: number,
    cropWidth: number,
    cropHeight: number,
    targetWidth: number,
    targetHeight: number,
    fileType: string,
  ) {
    // 1. Create a canvas for the cropped (clipped) area
    const sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = cropWidth;
    sourceCanvas.height = cropHeight;
    const ctx = sourceCanvas.getContext('2d');

    // Draw the clipped section onto the source canvas
    ctx.drawImage(
      sourceImage,
      cropX,
      cropY,
      cropWidth,
      cropHeight, // Source rectangle (clipping)
      0,
      0,
      cropWidth,
      cropHeight, // Destination rectangle
    );

    // 2. Create a destination canvas for the final resized output
    const destCanvas = document.createElement('canvas');
    destCanvas.width = targetWidth;
    destCanvas.height = targetHeight;

    // 3. Use Pica to resize the clipped canvas with high quality
    const resultCanvas = await pica.resize(sourceCanvas, destCanvas);

    // Convert result to a Blob or use directly
    const blob = await pica.toBlob(resultCanvas, fileType, 0.9);
    return blob;
  }

  return (
    <div>
      <STAMarkdown>{t('FileUploadDialog.instruction')}</STAMarkdown>
      <div className="d-flex align-items-center my-2" style={{ gap: '0.5rem' }}>
        <input
          type="radio"
          name="imageType"
          value="Token"
          id="token-option"
          checked={imageType === ImageType.Token}
          onChange={() => setImageType(ImageType.Token)}
        />
        <label htmlFor="token-option">Token</label>
      </div>
      <div className="d-flex align-items-center my-2" style={{ gap: '0.5rem' }}>
        <input
          type="radio"
          name="imageType"
          value="Image"
          id="image-option"
          checked={imageType === ImageType.Image}
          onChange={() => setImageType(ImageType.Image)}
        />
        <label htmlFor="image-option">Image</label>
      </div>

      {imageType === ImageType.Image ? (
        <input type="file" onChange={onFileChange} />
      ) : undefined}
      {fileData()}

      <div className="text-center my-3">
        <Button
          onClick={processImage}
          disabled={imageType === ImageType.Image && fileContents == null}
        >
          {t('Common.button.ok')}
        </Button>
      </div>
    </div>
  );
};

export class FileUploadDialog {
  show(
    onTokenSelected: () => void,
    onImageSelected: (image: ImageConfig) => void,
  ) {
    ModalControl.show(
      'lg',
      () => {},
      <FileUploadView
        onImageSelected={onImageSelected}
        onTokenSelected={onTokenSelected}
      />,
      i18next.t('FileUploadDialog.title'),
    );
  }

  hide() {
    ModalControl.hide();
  }
}
