import redisClient from "../config/redis"; // Adjust the import path as necessary

export async function safeUpdatePlayerPoint(gameId: string, playerId: string, pointToAdd: number) {
    const lockKey = `lock:game:${gameId}:player:${playerId}`;
    const playerKey = `game:${gameId}:player:${playerId}`;

    // Acquire lock for 5 seconds
    const isLocked = await redisClient.set(lockKey, "locked", {
        NX: true,  // Only set if not exists
        PX: 5000   // Expire in 5 seconds
    });

    if (!isLocked) {
        throw new Error(`Player ${playerId} is being updated. Try again.`);
    }

    try {
        // Read current point
        const pointStr = await redisClient.hGet(playerKey, "Point");
        const currentPoint = parseInt(pointStr || "0");

        // Update point
        await redisClient.hSet(playerKey, "Point", currentPoint + pointToAdd);

    } finally {
        // Release lock
        await redisClient.del(lockKey);
    }
}

export async function userJoinRoom(gameId: string, playerId: string, name: string) {
    const playerKey = `game:${gameId}:player:${playerId}`;

    // Initialize player data if not exists
    const exists = await redisClient.exists(playerKey);
    if (!exists) {
        await redisClient.hSet(playerKey, {
            Id: playerId,
            DisplayName: name,
            IsVoiceOn: 0,
            IsDisconnection: 0,
            Point: 0,
            IsReady: 0
        });
    }
}

export async function userLeaveRoom(gameId: string, playerId: string) {
    const playerKey = `game:${gameId}:player:${playerId}`;
    await redisClient.del(playerKey);
}

export async function createGameRoom(gameId: string, roomName: string) {
    const roomKey = `game:${gameId}`;
    await redisClient.hSet(roomKey, {
        Title: roomName,
        IsStart: 0,
        IsEnd: 0,
        CurrentRoundIndex: -1,
        DateTimeStart: 0,
        DateTimeEnd: 0,
        MaxPlayerCount: 0
    });
}

export async function randomGenerateRound(gameId: string, roundIndex: number) {
    const roundKey = `game:${gameId}:round:${roundIndex}`;
    const question = `Question for round ${roundIndex}`; // Replace with actual question generation logic
    await redisClient.hSet(roundKey, {
        Question: question,
        IsAnswered: 0,
        AnsweredBy: ""
    });
}
