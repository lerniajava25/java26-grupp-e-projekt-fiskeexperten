package org.example.fiskeexperten;

public record DemoCatch(
        int id,
        String species,
        String caughtAt,
        String location,
        String weight,
        String length,
        int mapX,
        int mapY,
        String colorVariant
) {
}
