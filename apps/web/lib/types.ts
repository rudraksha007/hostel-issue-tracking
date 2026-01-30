type Seat = {
    hostel: string;
    block: string;
    floor: string;
    room: string;
    seatId: string;
}
type Room = {
    id: string;
    roomNo: string;
    seats?: Record<string, { id: string; seatNo: string }>;
}
type Floor = {
    id: string;
    number: string;
    rooms?: Record<string, Room>;
}
type Block = {
    id: string;
    name: string;
    floors?: Record<string, Floor>
}
type Hostel = {
    id: string;
    name: string;
    blocks?: Record<string, Block>
}
type HostelData = Record<string, Hostel>;

export type {Seat, Room, Floor, Block, Hostel, HostelData};