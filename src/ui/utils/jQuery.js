import $ from 'jquery';

export default (root, selector) => $(root).find(selector).toArray();
