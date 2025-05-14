import filter from 'leo-profanity';

export const checkProfanity = ({title, content, authorName, tags}) => {

    if(filter.check(title.trim().toLowerCase())) {
        throw {
            messgae: 'Title contains inappropriate language',
            success: false,
            status: 400
        }
    }

    const cleanContent = filter.clean(content);

    if(filter.check(authorName)) {
        throw {
            message: 'Author name contains inappropriate language',
            success: false,
            status: 400
        }
    }

    const containsProfaneTag = tags.some(tag => filter.check(tag.trim().toLowerCase()));
    
    if(containsProfaneTag) {
        throw {
            message: 'Tags contains inappropriate language',
            success: false,
            status: 400
        }
    }

    const newTags = tags.map(tag => tag.trim().toLowerCase());
    
    return {cleanContent, newTags};
}