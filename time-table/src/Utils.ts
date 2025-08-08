

export const toArray = (args: string) =>{
    return args.split(',').map(item => item.trim());
} 