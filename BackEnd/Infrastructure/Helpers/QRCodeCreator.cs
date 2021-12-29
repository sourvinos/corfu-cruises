using System;
using System.Drawing;
using System.IO;
using QRCoder;

namespace BlueWaterCruises.Infrastructure.Helpers {

    public static class QrCodeCreator {

        public static byte[] CreateQrCode(string textToConvert) {
            QRCodeGenerator qrGenerator = new();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(textToConvert, QRCodeGenerator.ECCLevel.Q);
            QRCode qrCode = new(qrCodeData);
            return BitmapToBytes(qrCode.GetGraphic(20));
        }

        private static Byte[] BitmapToBytes(Bitmap bitmap) {
            using MemoryStream stream = new();
            bitmap.Save(stream, System.Drawing.Imaging.ImageFormat.Png);
            return stream.ToArray();
        }

    }

}