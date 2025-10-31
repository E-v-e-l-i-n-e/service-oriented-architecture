package com.evelina.labs.models;

import jakarta.xml.bind.annotation.XmlEnum;
import jakarta.xml.bind.annotation.XmlEnumValue;

@XmlEnum (String.class)
public enum MusicGenre {
    @XmlEnumValue("PROGRESSIVE_ROCK")
    PROGRESSIVE_ROCK,
    @XmlEnumValue("HIP_HOP")
    HIP_HOP,
    @XmlEnumValue("PUNK_ROCK")
    PUNK_ROCK;
}