/**
 * Icons from : https://github.com/astrit/css.gg
 *
 * using here as html template to inline the svg data
 */

import IconMusic from "./music.html";
import IconBook from "./book.html";
import IconPodcast from "./podcast.html";
import IconEye from "./eye.html";
import IconPen from "./pen.html";
import IconHeart from "./heart.html";
import IconMouth from "./mouth.html";
import IconOptions from "./options.html";
import IconUser from "./user.html";
import IconHome from "./home.html";

import IconPlay from "./play.html";
import IconPause from "./pause.html";
import IconStop from "./stop.html";
import IconSkipPrev from "./skip-prev.html";
import IconSkipNext from "./skip-next.html";
import IconCheck from "./check.html";
import IconClose from "./close.html";
import IconPlus from "./plus.html";

const music = scope => {
    typeof scope === 'undefined' ? scope = {} : null;
    return IconMusic({
        scope: {
            ...scope,
            height: scope.height || 24,
            width: scope.width || 24
        }
    });
}

const book = scope => {
    typeof scope === 'undefined' ? scope = {} : null;
    return IconBook({
        scope: {
            ...scope,
            height: scope.height || 24,
            width: scope.width || 24
        }
    });
}

const podcast = scope => {
    typeof scope === 'undefined' ? scope = {} : null;
    return IconPodcast({
        scope: {
            ...scope,
            height: scope.height || 24,
            width: scope.width || 24
        }
    });
}
const eye = scope => {
    typeof scope === 'undefined' ? scope = {} : null;
    return IconEye({
        scope: {
            ...scope,
            height: scope.height || 24,
            width: scope.width || 24
        }
    });
}

const pen = scope => {
    typeof scope === 'undefined' ? scope = {} : null;
    return IconPen({
        scope: {
            ...scope,
            height: scope.height || 24,
            width: scope.width || 24
        }
    });
}

const heart = scope => {
    typeof scope === 'undefined' ? scope = {} : null;
    return IconHeart({
        scope: {
            ...scope,
            height: scope.height || 24,
            width: scope.width || 24
        }
    });
}
const mouth = scope => {
    typeof scope === 'undefined' ? scope = {} : null;
    return IconMouth({
        scope: {
            ...scope,
            height: scope.height || 24,
            width: scope.width || 24
        }
    });
}
const options = scope => {
    typeof scope === 'undefined' ? scope = {} : null;
    return IconOptions({
        scope: {
            ...scope,
            height: scope.height || 24,
            width: scope.width || 24
        }
    });
}

const user = scope => {
    typeof scope === 'undefined' ? scope = {} : null;
    return IconUser({
        scope: {
            ...scope,
            height: scope.height || 24,
            width: scope.width || 24
        }
    });
}

const home = scope => {
    typeof scope === 'undefined' ? scope = {} : null;
    return IconHome({
        scope: {
            ...scope,
            height: scope.height || 24,
            width: scope.width || 24
        }
    });
}

const play = scope => {
    typeof scope === 'undefined' ? scope = {} : null;
    return IconPlay({
        scope: {
            ...scope,
            height: scope.height || 24,
            width: scope.width || 24
        }
    });
}

const pause = scope => {
    typeof scope === 'undefined' ? scope = {} : null;
    return IconPause({
        scope: {
            ...scope,
            height: scope.height || 24,
            width: scope.width || 24
        }
    });
}

const stop = scope => {
    typeof scope === 'undefined' ? scope = {} : null;
    return IconStop({
        scope: {
            ...scope,
            height: scope.height || 24,
            width: scope.width || 24
        }
    });
}

const skipPrev = scope => {
    typeof scope === 'undefined' ? scope = {} : null;
    return IconSkipPrev({
        scope: {
            ...scope,
            height: scope.height || 24,
            width: scope.width || 24
        }
    });
}

const skipNext = scope => {
    typeof scope === 'undefined' ? scope = {} : null;
    return IconSkipNext({
        scope: {
            ...scope,
            height: scope.height || 24,
            width: scope.width || 24
        }
    });
}

const check = scope => {
    typeof scope === 'undefined' ? scope = {} : null;
    return IconCheck({
        scope: {
            ...scope,
            height: scope.height || 24,
            width: scope.width || 24
        }
    });
}

const close = scope => {
    typeof scope === 'undefined' ? scope = {} : null;
    return IconClose({
        scope: {
            ...scope,
            height: scope.height || 24,
            width: scope.width || 24
        }
    });
}

const plus = scope => {
    typeof scope === 'undefined' ? scope = {} : null;
    return IconPlus({
        scope: {
            ...scope,
            height: scope.height || 24,
            width: scope.width || 24
        }
    });
}


export {
    home as home,
    options as options,
    user as user,
    music as music,
    book as book,
    podcast as podcast,
    eye as eye,
    pen as pen,
    heart as heart,
    mouth as mouth,
    play as play,
    pause as pause,
    stop as stop,
    skipPrev as skipPrev,
    skipNext as skipNext,
    check as check,
    close as close,
    plus as plus

}

