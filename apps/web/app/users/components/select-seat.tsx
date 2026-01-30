import { AggAPI } from "@/lib/api/agg";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { useEffect, useMemo, useState } from "react";
import type {Seat, Room, Floor, Block, Hostel, HostelData} from '@/lib/types';

type Props = {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    confSeat: (seat: string) => void;
}
export function SelectSeat({ setLoading, confSeat }: Props) {
    const [hostels, setHostels] = useState<HostelData>({});
    const [seat, setSeat] = useState<Partial<Seat>>({});
    const [allotSeat, setAllotSeat] = useState(false);

    useEffect(()=> {
        if (allotSeat && seat.seatId) {
            confSeat(seat.seatId);
        }
    }, [seat]);

    async function fetchData(type: 'hostels' | 'blocks' | 'floors' | 'rooms' | 'seats') {
        setLoading(true);
        const updated = await AggAPI.fetchHierarchicalData({
            type,
            hostelData: hostels,
            currentSelection: {
                hostel: seat.hostel,
                block: seat.block,
                floor: seat.floor,
                room: seat.room
            }
        });
        setHostels(updated);
        setLoading(false);
    }
    useEffect(() => {
        if (Object.keys(hostels).length > 0) return;
        fetchData('hostels');
    }, []);

    const Hostels = useMemo(() => {
        return Object.values(hostels).map(h => (<option key={h.id} value={h.id}>{h.name}</option>))
    }, [(Object.keys(hostels))])
    const Blocks = useMemo(() => {
        if (!seat.hostel) return null;
        const hostel = hostels[seat.hostel];
        if (!hostel) return null;
        else if (!hostel.blocks) fetchData('blocks');
        if (!hostel.blocks) return null;
        return Object.values(hostel.blocks).map(b => (<option key={b.id} value={b.id}>{b.name}</option>));
    }, [seat.hostel]);
    const Floors = useMemo(() => {
        if (!seat.hostel || !seat.block) return null;
        const hostel = hostels[seat.hostel];
        if (!hostel || !hostel.blocks) return null;
        const block = hostel.blocks[seat.block];
        if (!block) return null;
        else if (!block.floors) fetchData('floors');
        if (!block.floors) return null;
        return Object.values(block.floors).map(f => (<option key={f.id} value={f.id}>{f.number}</option>));
    }, [seat.hostel, seat.block]);
    const Rooms = useMemo(() => {
        if (!seat.hostel || !seat.block || !seat.floor) return null;
        const hostel = hostels[seat.hostel];
        if (!hostel || !hostel.blocks) return null;
        const block = hostel.blocks[seat.block];
        if (!block || !block.floors) return null;
        const floor = block.floors[seat.floor];
        if (!floor) return null;
        else if (!floor.rooms) fetchData('rooms');
        if (!floor.rooms) return null;
        return Object.values(floor.rooms).map(r => (<option key={r.id} value={r.id}>{r.roomNo}</option>));
    }, [seat.hostel, seat.block, seat.floor]);
    const Seats = useMemo(() => {
        if (!seat.hostel || !seat.block || !seat.floor || !seat.room) return null;
        const hostel = hostels[seat.hostel];
        if (!hostel || !hostel.blocks) return null;
        const block = hostel.blocks[seat.block];
        if (!block || !block.floors) return null;
        const floor = block.floors[seat.floor];
        if (!floor || !floor.rooms) return null;
        const room = floor.rooms[seat.room];
        if (!room) return null;
        else if (!room.seats) fetchData('seats');
        if (!room.seats) return null;
        return Object.values(room.seats).map(s => (<option key={s.id} value={s.id}>{s.seatNo}</option>));
    }, [seat.hostel, seat.block, seat.floor, seat.room]);
    return (
        <>
            <div className="space-y-2">
                <Label htmlFor="allot-seat">Allot Seat?</Label>
                <div className="flex items-center">
                    <Input 
                        id="allot-seat"
                        type='checkbox' 
                        checked={allotSeat} 
                        onChange={e => setAllotSeat(e.target.checked)}
                        className="w-4 h-4"
                    />
                </div>
            </div>
            {allotSeat && <>
                <div className="space-y-2">
                    <Label htmlFor="hostel">Hostel</Label>
                    <select 
                        name="hostel" 
                        id="hostel" 
                        onChange={(e) => setSeat(prev => ({ hostel: e.target.value }))}
                        className="block w-full px-3 py-2 border rounded-md bg-background text-foreground"
                    >
                        <option value="" disabled>Select Hostel</option>
                        {Hostels}
                    </select>
                </div>
                {seat.hostel && <>
                    <div className="space-y-2">
                        <Label htmlFor="block">Block</Label>
                        <select 
                            name="block" 
                            id="block" 
                            onChange={(e) => setSeat(prev => ({ hostel: prev.hostel, block: e.target.value }))} 
                            onClick={() => fetchData('blocks')}
                            className="block w-full px-3 py-2 border rounded-md bg-background text-foreground"
                        >
                            <option value="" disabled>Select Block</option>
                            {Blocks}
                        </select>
                    </div>
                    {
                        seat.block && <>
                            <div className="space-y-2">
                                <Label htmlFor="floor">Floor</Label>
                                <select 
                                    name="floor" 
                                    id="floor" 
                                    onChange={(e) => setSeat(prev => ({ hostel: prev.hostel, block: prev.block, floor: e.target.value }))} 
                                    onClick={() => fetchData('floors')}
                                    className="block w-full px-3 py-2 border rounded-md bg-background text-foreground"
                                >
                                    <option value="" disabled>Select Floor</option>
                                    {Floors}
                                </select>
                            </div>
                            {
                                seat.floor && <>
                                    <div className="space-y-2">
                                        <Label htmlFor="room">Room</Label>
                                        <select 
                                            name="room" 
                                            id="room" 
                                            onChange={(e) => setSeat(prev => ({ hostel: prev.hostel, block: prev.block, floor: prev.floor, room: e.target.value }))} 
                                            onClick={() => fetchData('rooms')}
                                            className="block w-full px-3 py-2 border rounded-md bg-background text-foreground"
                                        >
                                            <option value="" disabled>Select Room</option>
                                            {Rooms}
                                        </select>
                                    </div>
                                    {
                                        seat.room && <>
                                            <div className="space-y-2">
                                                <Label htmlFor="seat">Seat</Label>
                                                <select 
                                                    name="seat" 
                                                    id="seat" 
                                                    onChange={(e) => setSeat(prev => ({ hostel: prev.hostel, block: prev.block, floor: prev.floor, room: prev.room, seatNo: e.target.value }))} 
                                                    onClick={() => fetchData('seats')}
                                                    className="block w-full px-3 py-2 border rounded-md bg-background text-foreground"
                                                >
                                                    <option value="" disabled>Select Seat</option>
                                                    {Seats}
                                                </select>
                                            </div>
                                        </>
                                    }
                                </>
                            }
                        </>
                    }
                </>}
            </>

            }
        </>
    )
}