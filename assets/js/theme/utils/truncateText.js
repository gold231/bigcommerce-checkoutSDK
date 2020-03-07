import _ from 'lodash';

export default function truncateText ($textBlock) {
  const length = $textBlock.data('excerpt-length') || 200;

  if($textBlock.text().length > length){
    let text =  _.truncate($textBlock.text(), {
      length,
      separator: ' ',
    });

    const links = $textBlock.find('a');

    $(links).each((i, el) => {
      const valueToReplace = text.match(el);

      if (valueToReplace) {
        text = text.replace(valueToReplace[0], el.outerHTML);
      }
    });

    $textBlock.html(text);
  }

  $textBlock.addClass('loaded');
}
