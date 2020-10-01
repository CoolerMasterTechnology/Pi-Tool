#!/bin/sh
printf "\e[38;5;91mCooler Master Pi Tool minimal CLI"
printf "\e[37m\e[0m\n"
sleep 0.5

CONFIGF="/boot/config.txt"

tenpercent()
{
        echo ""
        echo arm_freq=1650 >> $CONFIGF
        echo gpu_freq=550 >> $CONFIGF
        echo over_voltage=2 >> $CONFIGF
        echo ""
        echo "\e[32m Done!\e[0m"
        echo ""
}

twentypercent()
{
        echo ""
        echo arm_freq=1800 >> $CONFIGF
        echo gpu_freq=600 >> $CONFIGF
        echo over_voltage=4 >> $CONFIGF
        echo ""
        echo "\e[32m Done!\e[0m"
        echo ""
}

thirtypercent()
{
        echo ""
        echo arm_freq=1950 >> $CONFIGF
        echo gpu_freq=650 >> $CONFIGF
        echo over_voltage=5 >> $CONFIGF
        echo ""
        echo "\e[32m Done!\e[0m"
        echo ""
}

restorebase()
{
        echo "Restore base values..."
}

while true; do
        printf "\na.) Overclock 10 Percent\nb.) Overclock 20 Percent\nc.) Overclock 30 Percent\nd.) Restore base values\nz.) Exit\n"
        read -p "Do you want to overclock or restore the base values? [a/b/c/d/z]: " abcdz
        case $abcdz in
                [a]* ) tenpercent; break;;
                [b]* ) twentypercent; break;;
                [c]* ) thirtypercent; break;;
                [d]* ) restorebase; break;;
                [z]* ) break;;
                * ) printf "\nPlease answer with a, b, c, d or z\n";;
        esac
done

sleep 1
exit 0;
