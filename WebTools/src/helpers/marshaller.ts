import base64url from 'base64url';
import huffman from 'rfc7541-huffman';

class Marshaller {

    encode(json: any) {
        let text = JSON.stringify(json);
        console.log(text.length);
        let encoded = huffman.encode(text);
        return base64url.encode(encoded);
    }

    decode(s: string) {
        if (s) {
            let encoded = base64url.toBuffer(s);
            let text = huffman.decode(encoded);
            return JSON.parse(text);
        } else {
            return undefined;
        }
    }
}

export const marshaller = new Marshaller();
