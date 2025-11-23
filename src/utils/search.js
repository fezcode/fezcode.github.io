export const filterItems = (items, searchTerm) => {
    if (!searchTerm) {
        return items;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const searchWords = lowerCaseSearchTerm.split(' ').filter(w => w);

    return items.filter(item => {
        const targetText = [
            item.title?.toLowerCase(),
            item.type?.toLowerCase(),
            ...(item.tags || []).map(tag => tag.toLowerCase()),
            ...(item.technologies || []).map(tech => tech.toLowerCase()),
            item.category?.toLowerCase(),
        ].filter(Boolean).join(' ');

        return searchWords.every(word => targetText.includes(word));
    });
};
