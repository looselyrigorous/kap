import electron from 'electron';
import {Container} from 'unstated';
import ipc from 'electron-better-ipc';

export default class ExportsContainer extends Container {
  state = {
    exports: []
  }

  mount = async () => {
    console.log('here');
    const exports = await ipc.callMain('get-exports');

    this.setState({exports: exports.sort((a, b) => a.createdAt - b.createdAt)});

    ipc.answerMain('update-export', this.update);
  }

  update = updates => {
    const {createdAt} = updates;
    const {exports} = this.state;

    const index = exports.findIndex(exp => exp.createdAt === createdAt);
    if (index === -1) {
      exports.unshift(updates);
    } else {
      exports[index] = updates;
    }

    this.setState({exports});
  }

  add = () => {
    ipc.callMain('export', {some: 'data'});
  }

  cancel = createdAt => {
    ipc.callMain('cancel-export', createdAt);
  }
}