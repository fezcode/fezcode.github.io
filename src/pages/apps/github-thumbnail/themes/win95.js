import { wrapText } from '../utils';

export const win95 = (ctx, width, height, scale, data) => {
    const { repoOwner, repoName, description } = data;
    // WINDOWS 95 Style

    // 1. Desktop Background (Teal)
    ctx.fillStyle = '#008080';
    ctx.fillRect(0, 0, width, height);

    // 2. Main Window
    const winW = width * 0.7;
    const winH = height * 0.6;
    const winX = (width - winW) / 2;
    const winY = (height - winH) / 2;

    const gray = '#c0c0c0';
    const darkGray = '#808080';
    const white = '#ffffff';
    const black = '#000000';
    const navy = '#000080';

    // Window Body
    ctx.fillStyle = gray;
    ctx.fillRect(winX, winY, winW, winH);

    // 3D Borders (Bevel)
    const drawBevel = (x, y, w, h, isPressed = false) => {
        const t = 2 * scale; // thickness
        // Top/Left
        ctx.fillStyle = isPressed ? darkGray : white;
        ctx.fillRect(x, y, w, t); // Top
        ctx.fillRect(x, y, t, h); // Left

        // Bottom/Right
        ctx.fillStyle = isPressed ? white : black;
        ctx.fillRect(x, y + h - t, w, t); // Bottom
        ctx.fillRect(x + w - t, y, t, h); // Right

        // Inner shadow for unpressed
        if (!isPressed) {
            ctx.fillStyle = darkGray;
            ctx.fillRect(x + t, y + h - t*2, w - t*2, t);
            ctx.fillRect(x + w - t*2, y + t, t, h - t*2);
        }
    };

    drawBevel(winX, winY, winW, winH);

    // Title Bar
    const titleH = 40 * scale;
    const titlePad = 4 * scale;
    ctx.fillStyle = navy;
    ctx.fillRect(winX + titlePad, winY + titlePad, winW - titlePad*2, titleH);

    // Title Text
    ctx.fillStyle = white;
    ctx.textAlign = 'left';
    ctx.font = `bold ${20 * scale}px "Arial", sans-serif`;
    ctx.fillText(`${repoOwner} - Notepad`, winX + titlePad + 10*scale, winY + titlePad + 28*scale);

    // X Button
    const btnSize = titleH - 4*scale;
    const btnX = winX + winW - titlePad - btnSize - 2*scale;
    const btnY = winY + titlePad + 2*scale;
    ctx.fillStyle = gray;
    ctx.fillRect(btnX, btnY, btnSize, btnSize);
    drawBevel(btnX, btnY, btnSize, btnSize);
    ctx.fillStyle = black;
    ctx.textAlign = 'center';
    ctx.font = `bold ${18 * scale}px "Arial", sans-serif`;
    ctx.fillText("X", btnX + btnSize/2, btnY + btnSize/2 + 6*scale);

    // Menu Bar (File Edit View...)
    const menuY = winY + titlePad + titleH;

    ctx.fillStyle = black;
    ctx.textAlign = 'left';
    ctx.font = `normal ${18 * scale}px "Arial", sans-serif`;
    ctx.fillText("File   Edit   Search   Help", winX + 15*scale, menuY + 20*scale);

    // Text Area (White input box)
    const areaX = winX + 10*scale;
    const areaY = menuY + 30*scale;
    const areaW = winW - 20*scale;
    const areaH = winH - (areaY - winY) - 10*scale;

    ctx.fillStyle = white;
    ctx.fillRect(areaX, areaY, areaW, areaH);
    // Inset border for text area
    ctx.fillStyle = darkGray; // Top/Left shadow
    ctx.fillRect(areaX, areaY, areaW, 2*scale);
    ctx.fillRect(areaX, areaY, 2*scale, areaH);
    ctx.fillStyle = '#dfdfdf'; // Bottom/Right highlight (light gray)
    ctx.fillRect(areaX, areaY + areaH - 2*scale, areaW, 2*scale);
    ctx.fillRect(areaX + areaW - 2*scale, areaY, 2*scale, areaH);

    // Content Text
    ctx.fillStyle = black;
    ctx.font = `bold ${60 * scale}px "Courier New", monospace`; // Monospace for that raw feel
    ctx.fillText(repoName, areaX + 20*scale, areaY + 80*scale);

    ctx.font = `normal ${24 * scale}px "Courier New", monospace`;
    wrapText(ctx, description, areaX + 20*scale, areaY + 140*scale, areaW - 40*scale, 35*scale);

    // Cursor (Blinking)
    // We can't actually blink in static canvas, but we draw it
    // Let's put it after the description? Or just at the end.
    // Simplifying: Just drawing it below description
    // ctx.fillRect(areaX + 20*scale, areaY + 200*scale, 15*scale, 2*scale); // Underscore cursor

    // 3. Desktop Icons (Left side)
    const iconSize = 60 * scale;
    const startIconY = 40 * scale;
    const iconGap = 100 * scale;

    const drawIcon = (label, y, type='folder') => {
        const x = 40 * scale;
        // Icon graphic (Simple pixel art approx)
        if (type === 'pc') {
            ctx.fillStyle = black;
            ctx.fillRect(x, y, iconSize, iconSize * 0.8);
            ctx.fillStyle = '#00ffff'; // Screen
            ctx.fillRect(x+4*scale, y+4*scale, iconSize-8*scale, iconSize*0.5);
        } else {
            // Folder
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + iconSize*0.4, y);
            ctx.lineTo(x + iconSize*0.5, y + iconSize*0.1);
            ctx.lineTo(x + iconSize, y + iconSize*0.1);
            ctx.lineTo(x + iconSize, y + iconSize*0.8);
            ctx.lineTo(x, y + iconSize*0.8);
            ctx.fill();
            ctx.stroke();
        }

        // Label
        ctx.fillStyle = white; // Icon text usually has transparent bg in 95 but let's just do white text with shadow
        ctx.font = `normal ${16 * scale}px "Arial", sans-serif`;
        ctx.textAlign = 'center';

        // Dotted focus rect for selected icon?
        // ctx.setLineDash([2, 2]);
        // ctx.strokeStyle = white;
        // ctx.strokeRect(x - 10*scale, y + iconSize, iconSize + 20*scale, 20*scale);
        // ctx.setLineDash([]);

        ctx.fillText(label, x + iconSize/2, y + iconSize + 20*scale);
    };

    drawIcon("My Computer", startIconY, 'pc');
    drawIcon("Network", startIconY + iconGap, 'pc');
    drawIcon("Recycle Bin", startIconY + iconGap*2, 'folder');

    // 4. Taskbar
    const taskH = 40 * scale;
    const taskY = height - taskH;
    ctx.fillStyle = gray;
    ctx.fillRect(0, taskY, width, taskH);
    ctx.fillStyle = white; // Top highlight
    ctx.fillRect(0, taskY, width, 2*scale);

    // Start Button
    const startW = 100 * scale;
    const startH = taskH - 6*scale;
    const startX = 4*scale;
    const startY = taskY + 3*scale;
    drawBevel(startX, startY, startW, startH);

    ctx.fillStyle = black;
    ctx.font = `bold ${18 * scale}px "Arial", sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText("Start", startX + 35*scale, startY + 22*scale);

    // Windows Logo on start button (Simple blocks)
    const logoX = startX + 6*scale;
    const logoY = startY + 6*scale;
    const logoS = 20*scale;
    ctx.fillStyle = '#ff0000'; ctx.fillRect(logoX, logoY, logoS/2, logoS/2);
    ctx.fillStyle = '#00ff00'; ctx.fillRect(logoX + logoS/2, logoY, logoS/2, logoS/2);
    ctx.fillStyle = '#0000ff'; ctx.fillRect(logoX, logoY + logoS/2, logoS/2, logoS/2);
    ctx.fillStyle = '#ffff00'; ctx.fillRect(logoX + logoS/2, logoY + logoS/2, logoS/2, logoS/2);

    // Tray Area (Time)
    const trayW = 100 * scale;
    const trayX = width - trayW - 4*scale;
    const trayY = taskY + 4*scale;
    const trayH = taskH - 8*scale;

    // Sunken tray
    ctx.fillStyle = white; ctx.fillRect(trayX + trayW - 2*scale, trayY, 2*scale, trayH); // Right
    ctx.fillRect(trayX, trayY + trayH - 2*scale, trayW, 2*scale); // Bottom
    ctx.fillStyle = darkGray; ctx.fillRect(trayX, trayY, trayW, 2*scale); // Top
    ctx.fillRect(trayX, trayY, 2*scale, trayH); // Left

    ctx.fillStyle = black;
    ctx.textAlign = 'center';
    ctx.fillText("10:00 AM", trayX + trayW/2, trayY + 22*scale);

    // App Button on Taskbar (Active)
    const appW = 200 * scale;
    const appX = startX + startW + 10*scale;
    const appY = startY;

    // Pressed look
    drawBevel(appX, appY, appW, startH, true);
    ctx.fillStyle = black;
    ctx.textAlign = 'left';
    ctx.fillText(`${repoName} - Notepad`, appX + 10*scale, appY + 22*scale);
};
