export class C2BufferInterrupted extends Error {
    constructor(message: string = 'Converting to Buffer is interrupted by something') {
        super(message);
        this.name = 'C2BufferInterrupted';
    }
}

export class LoadingBufferInterrupted extends Error {
    constructor(message: string = 'Loading Buffer is interrupted by something') {
        super(message);
        this.name = 'LoadingBufferInterrupted';
    }
}
