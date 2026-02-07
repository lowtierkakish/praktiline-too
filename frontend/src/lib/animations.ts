const animations = {
    openSection: "transition-all duration-150 hover:scale-105 hover:shadow-md hover:bg-blue-50",
    hoverScale: "transition-transform duration-150 hover:scale-105",
    hoverBlue: "transition-colors duration-550 hover:bg-blue-50 hover:text-blue-600",
    hoverAmber: "transition-colors duration-550 hover:bg-amber-50 hover:text-blue-600",
    fadeIn: "animate-in fade-in-0 duration-200",
    slideDown: "transition-all duration-300 ease-out",
    buttonHover: "transition-all duration-150 hover:scale-105 active:scale-95",
    iconHover: "transition-transform duration-700 group-hover:scale-110",
    expandContent: "transition-all duration-300 ease-in-out",
    fadeSlideIn: "animate-in fade-in-0 slide-in-from-left-2 duration-300",
    fadeSlideOut: "animate-out fade-out-0 slide-out-to-left-2 duration-300",
    scaleIn: "animate-in zoom-in-95 duration-200",
    scaleOut: "animate-out zoom-out-95 duration-200",
}

export const getAnimation = (...animationKeys: (keyof typeof animations)[]) => {
    return animationKeys.map(key => animations[key]).join(' ')
}