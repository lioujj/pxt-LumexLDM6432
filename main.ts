/**
* LUMEX LDM顯示器的函數
*/

//% weight=0 color=#ff9933 icon="\uf233" block="LDM64*32"
namespace LumexLDM {

    export enum fontSize {
        //% block="5*7"
        smallSize = 0x81,
        //% block="8*16"
        bigSize = 0x83
    }
    export enum showNow {
        //% block="now"
        yes = 0xd1,
        //% block="later"
        no = 0x00
    }
    export enum patternType {
        //% block="8*8"
        type1 = 0xc0,
        //% block="8*16"
        type2 = 0xc1,
        //% block="16*16"
        type3 = 0xc2,
        //% block="32*32"
        type4 = 0xc3
    }
    export enum positiveType {
        //% block="positive"
        type1 = 1,
        //% block="negative"
        type2 = 0
    }
    export enum filledType {
        //% block="no"
        type1 = 0,
        //% block="yes"
        type2 = 1
    }
    export enum transitionType {
        //% block="upward"
        type1 = 0,
        //% block="downward"
        type2 = 1,
        //% block="leftward"
        type3 = 2,
        //% block="rightward"
        type4 = 3
    }

    export enum moveType {
        //% block="inside out"
        type1 = 0,
        //% block="outside in"
        type2 = 1
    }

    export enum colorCode {
        //% block="black"
        color0 = 0,
        //% block="white"
        color111 = 111,
        //% block="red"
        color96 = 96,
        //% block="orange"
        color100 = 100,
        //% block="yellow"
        color108 = 108,
        //% block="green"
        color4 = 4,
        //% block="blue"
        color3 = 3,
        //% block="indigo"
        color66 = 66,
        //% block="purple"
        color99 = 99,
        //% block="dark red"
        color32 = 32,
        //% block="pink"
        color103 = 103,
        //% block="earth yellow"
        color104 = 104,
        //% block="lime"
        color12 = 12
    }

    export enum animationType {
        //% block="fly in and out upward"
        type1 = 2,
        //% block="fly in and out downward"
        type2 = 3,
        //% block="fly in and out leftward"
        type3 = 4,
        //% block="fly in and out rightward"
        type4 = 5,
        //% block="blink"
        type5 = 6,
        //% block="fly in downward"
        type6 = 7,
        //% block="fly in upward"
        type7 = 8,
        //% block="fly in rightward"
        type8 = 9,
        //% block="fly in leftward"
        type9 = 10,
        //% block="fly in down-rightward"
        type10 = 11,
        //% block="fly in down-leftward"
        type11 = 12,
        //% block="fly in up-rightward"
        type12 = 13,
        //% block="fly in up-leftward"
        type13 = 14,
        //% block="fly in from each direction"
        type14 = 15
    }

    function convertNumToHexStr(myNum: number, digits: number): string {
        let tempDiv = 0
        let tempMod = 0
        let myStr = ""
        tempDiv = myNum
        while (tempDiv > 0) {
            tempMod = tempDiv % 16
            if (tempMod > 9) {
                myStr = String.fromCharCode(tempMod - 10 + 97) + myStr
            } else {
                myStr = tempMod + myStr
            }
            tempDiv = Math.idiv(tempDiv, 16)
        }
        while (myStr.length != digits) {
            myStr = "0" + myStr
        }
        return myStr
    }

    //% blockId="LDM_setSerial" block="set LDM RX to %pinRX|TX to %pinTX|BaudRate %br"
    //% weight=100 blockGap=2 blockInlineInputs=true
    export function LDM_setSerial(pinRX: SerialPin, pinTX: SerialPin, br: BaudRate): void {
        basic.pause(300)
        serial.redirect(
            pinRX,
            pinTX,
            br
        )
        serial.readUntil("E")
        basic.pause(3)
    }

    //% blockId="LDM_getColor" block="color code %myColor"
    //% weight=95 blockGap=2
    export function LDM_getColor(myColor: colorCode): number {
        return myColor
    }

    //% blockId="LDM_clear" block="LDM clear"
    //% weight=93 blockGap=2
    export function LDM_clear(): void {
        serial.writeString("ATd0=()")
        serial.readUntil("E")
        basic.pause(3)
    }

    //% blockId="LDM_putString" block="LDM put string: %myStr|size: %mySize|on line: %line|column: %column|color code(0~111): %color"
    //% weight=90 blockGap=10 blockInlineInputs=true line.min=0 line.max=3 column.min=0 column.max=19 color.min=0 color.max=111
    export function LDM_putString(myStr: string, mySize: fontSize, line: number, column: number, color: number): void {
        if (myStr.length > 0) {
            serial.writeString("ATef=(" + color + ")")
            serial.readUntil("E")
            basic.pause(3)
            if (mySize == 0x81)
                serial.writeString("AT81=(" + line + "," + column + "," + myStr + ")")
            else if (mySize == 0x83)
                serial.writeString("AT83=(" + line + "," + column + "," + myStr + ")")
            serial.readUntil("E")
            basic.pause(3)
        }
    }

    //% blockId="LDM_playPage1" block="display single page(0~6) stored in the LDM without animation: %myPage"
    //% weight=85 blockGap=2 blockInlineInputs=true myPage.min=0 myPage.max=6
    export function LDM_playPage1(myPage: number): void {
        serial.writeString("ATfd=(0)")
        serial.readUntil("E")
        basic.pause(3)
        serial.writeString("ATfc=(" + myPage + ")")
        serial.readUntil("E")
        basic.pause(3)
    }

    //% blockId="LDM_playPage2" block="display single page(0~6) stored in the LDM: %myPage|animation %effect|speed(1~10) %speed"
    //% weight=80 blockGap=2 blockInlineInputs=true myPage.min=0 myPage.max=6 effect.min=1 effect.max=15 speed.min=1 speed.max=10
    export function LDM_playPage2(myPage: number, effect: animationType, speed: number): void {
        //清掉特效
        serial.writeString("ATfd=(0)")
        serial.readUntil("E")
        basic.pause(3)
        //設定速度及特效
        serial.writeString("ATbf=(" + speed + ")")
        serial.readUntil("E")
        basic.pause(3)
        serial.writeString("ATfc=(" + myPage + ")")
        serial.readUntil("E")
        basic.pause(3)
        serial.writeString("ATfd=(" + effect + ")")
        serial.readUntil("E")
        basic.pause(3)
    }

    //% blockId="LDM_playPages" block="display multi pages stored in the LDM |number of pages(2~7) %pages|page interval period(1~10) %period|animation %effect|animation speed(1~10) %speed"
    //% weight=75 blockGap=2 blockInlineInputs=true pages.min=2 pages.max=7 effect.min=16 effect.max=30 period.min=1 period.max=10 speed.min=1 speed.max=10
    export function LDM_playPages(pages: number, period: number, effect: animationType, speed: number): void {
        //清掉特效
        serial.writeString("ATfd=(0)")
        serial.readUntil("E")
        basic.pause(3)
        serial.writeString("ATdf=(" + pages + ")")
        serial.readUntil("E")
        basic.pause(3)
        serial.writeString("ATbe=(" + period + ")")
        serial.readUntil("E")
        basic.pause(3)
        serial.writeString("ATbf=(" + speed + ")")
        serial.readUntil("E")
        basic.pause(3)
        if (effect > 1 && effect < 7)
            effect += 14
        else if (effect > 6 && effect < 16)
            effect += 15
        serial.writeString("ATfd=(" + effect + ")")
        serial.readUntil("E")
        basic.pause(3)
    }

    //% blockId="LDM_stopPages" block="stop display animation"
    //% weight=70 blockGap=10 blockInlineInputs=true
    export function LDM_stopPages(): void {
        serial.writeString("ATfd=(0)")
        serial.readUntil("E")
        basic.pause(3)
    }

    //% blockId="LDM_setBackColor" block="set LDM background color %backColor"
    //% weight=60 blockGap=2 backColor.min=0 backcolor.max=111 
    export function LDM_setBackColor(backColor: number): void {
        serial.writeString("ATec=(" + backColor + ")")
        serial.readUntil("E")
        basic.pause(3)
    }
    
    //% blockId="LDM_display" block="LDM display"
    //% weight=55 blockGap=2
    export function LDM_display(): void {
        serial.writeString("ATd1=()")
        serial.readUntil("E")
        basic.pause(3)
    }


    //% blockId="LDM_on" block="turn LDM on"
    //% weight=50 blockGap=2
    export function LDM_on(): void {
        serial.writeString("ATf1=()")
        serial.readUntil("E")
        basic.pause(3)
    }

    //% blockId="LDM_off" block="turn LDM off"
    //% weight=45 blockGap=2
    export function LDM_off(): void {
        serial.writeString("ATf0=()")
        serial.readUntil("E")
        basic.pause(3)
    }

    //% blockId="LDM_setBrightess" block="set LDM brightness(0~11) %brightness"
    //% weight=40 blockGap=2 brightness.min=0 brightness.max=11
    export function LDM_setBrightness(brightness: number): void {
        serial.writeString("ATf2=(" + brightness + ")")
        serial.readUntil("E")
        basic.pause(3)
    }

    //% blockId="LDM_saveToRom" block="write dipslay contents to current displayed EEPROM page address"
    //% weight=100 blockGap=2 advanced=true
    export function LDM_saveToRom(): void {
        serial.writeString("ATfe=()")
        serial.readUntil("E")
        basic.pause(3)
    }

    //% blockId="LDM_drawLine" block="draw a line|first point X %x0|first point Y %y0|second point X %x1|second point Y %y1|color code(0~111) %color"
    //% weight=98 blockGap=2 blockInlineInputs=true x0.min=0 x0.max=63 y0.min=0 y0.max=31 x1.min=0 x1.max=63 y1.min=0 y1.max=31 color.min=0 color.max=111 advanced=true
    export function LDM_drawLine(x0: number, y0: number, x1: number, y1: number, color: number): void {
        serial.writeString("AT90=(" + x0 + "," + y0 + "," + x1 + "," + y1 + "," + color + ")")
        serial.readUntil("E")
        basic.pause(3)
    }
    //% blockId="LDM_drawRectangle" block="draw a rectangle|filled %myFilled|up left corner X %x0|up left corner Y %y0|bottom right corner X %x1|bottom right corner Y %y1|color code(0~111) %color"
    //% weight=95 blockGap=2 blockInlineInputs=true x0.min=0 x0.max=63 y0.min=0 y0.max=31 x1.min=0 x1.max=63 y1.min=0 y1.max=31 color.min=0 color.max=111 advanced=true
    export function LDM_drawRectangle(myFilled: filledType, x0: number, y0: number, x1: number, y1: number, color: number): void {
        if (myFilled == 0)
            serial.writeString("AT91=(" + x0 + "," + y0 + "," + x1 + "," + y1 + "," + color + ")")
        else
            serial.writeString("AT92=(" + x0 + "," + y0 + "," + x1 + "," + y1 + "," + color + ")")
        serial.readUntil("E")
        basic.pause(3)
    }

    //% blockId="LDM_drawCircle" block="draw a circle|filled %myFilled|center X %x0|center Y %y0|radius %radius|color code(0~111) %color"
    //% weight=90 blockGap=2 blockInlineInputs=true x0.min=0 x0.max=63 y0.min=0 y0.max=31 color.min=0 color.max=111 advanced=true
    export function LDM_drawCircle(myFilled: filledType, x0: number, y0: number, radius: number, color: number): void {
        if (myFilled == 0)
            serial.writeString("AT94=(" + x0 + "," + y0 + "," + radius + "," + color + ")")
        else
            serial.writeString("AT95=(" + x0 + "," + y0 + "," + radius + "," + color + ")")
        serial.readUntil("E")
        basic.pause(3)
    }

    //% blockId="LDM_drawSquare" block="draw a square|up left corner X %x0|up left corner Y %y0|width %width|color code(0~111) %color"
    //% weight=85 blockGap=2 blockInlineInputs=true x0.min=0 x0.max=63 y0.min=0 y0.max=31 color.min=0 color.max=111 advanced=true
    export function LDM_drawSquare(x0: number, y0: number, width: number, color: number): void {
        serial.writeString("AT93=(" + x0 + "," + y0 + "," + width + "," + color + ")")
        serial.readUntil("E")
        basic.pause(3)
    }

    //% blockId="LDM_setPixel" block="draw a pixel|X %x0|Y %y0|color code(0~111) %color"
    //% weight=80 blockGap=10 blockInlineInputs=true x0.min=0 x0.max=63 y0.min=0 y0.max=31 color.min=0 color.max=111 advanced=true
    export function LDM_setPixel(x0: number, y0: number, color: number): void {
        serial.writeString("ATef=(" + color + ")")
        serial.readUntil("E")
        basic.pause(3)
        serial.writeString("AT9e=(" + x0 + "," + y0 + ")")
        serial.readUntil("E")
        basic.pause(3)
    }
    //% blockId="LDM_setScroll" block="scroll the whole display %transition|shift time(1~200ms) %time"
    //% weight=75 blockGap=2 blockInlineInputs=true time.min=1 time.max=200 advanced=true
    export function LDM_setScroll(transition: transitionType, time: number): void {
        if (time < 1)
            time = 1
        if (time > 200)
            time = 200
        serial.writeString("AT" + convertNumToHexStr(transition + 0xd2, 2) + "=(" + time + ")")
        serial.readUntil("E")
        basic.pause(3)
    }

    //% blockId="LDM_eraseImageInOut" block="erase the whole display %myMove|shift time(1~200ms) %time"
    //% weight=70 blockGap=2 time.min=1 time.max=200 blockInlineInputs=true advanced=true
    export function LDM_eraseImageInOut(myMove: moveType, time: number): void {
        serial.writeString("AT" + convertNumToHexStr(myMove + 0xaa, 2) + "=(" + time + ")")
        serial.readUntil("E")
        basic.pause(3)
    }

    //% blockId="LDM_showImageInOut" block="display the whole display %myMove|shift time(1~200ms) %time"
    //% weight=65 blockGap=2 time.min=1 time.max=200 blockInlineInputs=true advanced=true
    export function LDM_showImageInOut(myMove: moveType, time: number): void {
        serial.writeString("AT" + convertNumToHexStr(myMove + 0xa8, 2) + "=(" + time + ")")
        serial.readUntil("E")
        basic.pause(3)
    }
}  
