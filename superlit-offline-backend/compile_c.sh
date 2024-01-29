gcc "$1" -o /tmp/"$2" && /tmp/"$2"
rm -f /tmp/"$2"
rm -f "$1"