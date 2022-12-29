import path from 'path';
import { visit } from 'unist-util-visit';
// Changes local image files to a GitHub image link
export default function remarkGithubImages({ baseUrl }) {
    return (tree) => {
        visit(tree, 'paragraph', (node) => {
            for (const child of node.children) {
                if (child.type === 'image') {
                    // If the image isn't a URL already, assume it's local
                    try {
                        new URL(child.url);
                    } catch {
                        // Checks if a path is actually present
                        const splitPath = child.url.split(path.sep);
                        if (splitPath.length <= 0) {
                            continue;
                        }
                        const trimmedFilePath = splitPath.slice(0, -2);
                        const imageLocation = trimmedFilePath.findLastIndex((e) => e === 'Images');
                        child.url =
                            baseUrl +
                            (baseUrl.slice(-1) === '/' ? '' : '/') +
                            splitPath.slice(imageLocation, splitPath.length).join('/') +
                            '?raw=1';
                    }
                }
            }
        });
    };
}
