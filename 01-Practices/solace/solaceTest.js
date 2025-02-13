import exec from 'k6/exec';

export default function () {
    exec('node solacePublisher.js');
}
