import html from '../img/svg/skills/html.svg'
import photoshop from '../img/svg/skills/photoshop.svg'
import css from '../img/svg/skills/css.svg'
import javascript from '../img/svg/skills/javascript.svg'
import react from '../img/svg/skills/react.svg'
import php from '../img/svg/skills/php.svg'
import python from '../img/svg/skills/python.svg'
import git from '../img/svg/skills/git.svg'
import figma from '../img/svg/skills/figma.svg'
import canva from '../img/svg/skills/canva.svg'
import joomla from '../img/svg/skills/joomla.svg'
import replit from '../img/svg/skills/replit.svg'
import sqlite from '../img/svg/skills/sqlite.svg'
import renpy from '../img/svg/skills/renpy.svg'
import postgresql from '../img/svg/skills/postgresql.svg'
import pandas from '../img/svg/skills/pandas.svg'
import pytorch from '../img/svg/skills/pytorch.svg'

export const skillsImage = (skill) => {
    if (!skill) return null;
    
    const skillID = skill.toLowerCase();
    switch (skillID) {
        case 'html':
            return html;
        case 'photoshop':
            return photoshop;
        case 'css':
            return css;
        case 'replit':
            return replit;    
        case 'joomla':
            return joomla;
        case 'javascript':
            return javascript;
        case 'react':
            return react;
        case 'php':
            return php;
        case 'python':
            return python;
        case 'git':
            return git;
        case 'figma':
            return figma;
        case 'canva':
            return canva;
        case 'postgresql':
            return postgresql;
        case 'sqlite':
            return sqlite;
        case 'renpy':
            return renpy;
        case 'pandas':
            return pandas;
        case 'pytorch':
            return pytorch;
        default:
            console.warn(`Skill image not found for: ${skill}`);
            return null;
    }
}