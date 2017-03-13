#!/bin/sh
env $(cat variables.env | xargs) $@ 

