<?php

class Bullet
{
    private $x, $y, $y1, $x1, $speed;

    function __construct($x, $x1, $y, $y1, $speed)
    {
        $this->x = $x;
        $this->x1 = $x1;
        $this->y = $y;
        $this->y1 = $y1;
        $this->speed = $speed;
    }
}