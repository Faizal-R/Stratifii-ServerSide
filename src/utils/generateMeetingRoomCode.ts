export function createMeetingRoom(): string {
    const randomWord = (length: number) => {
        const chars = 'abcdefghijklmnopqrstuvwxyz';
        let word = '';
        for (let i = 0; i < length; i++) {
            word += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return word;
    };

    const roomCode = `${randomWord(3)}-${randomWord(4)}-${randomWord(3)}`;
    return roomCode;
}


