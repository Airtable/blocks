import '../src';
import {FieldType} from '@airtable/blocks/models';
import {base, globalConfig, reload, settingsButton, undoRedo, viewport} from '@airtable/blocks';
import {blockStats, trackEvent} from '@airtable/blocks/unstable_private_utils';

const errorMessage = `Unable to simulate behavior

Extensions which retrieve model references using JavaScript \`import\` declarations cannot be tested. To resolve this, replace \`import\` declaration in your Extension's source code with corresponding React Hooks. For instance, replace

    import {base} from "@airtable/blocks";

with

    const base = useBase();`;

describe('untestable bindings', () => {
    let warnSpy: jest.SpyInstance;

    beforeEach(() => {
        warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        warnSpy.mockRestore();
    });

    describe('@airtable/blocks', () => {
        describe('base', () => {
            it('checkPermissionsForCreateTable', () => {
                expect(() => {
                    base.checkPermissionsForCreateTable();
                }).toThrowError(errorMessage);
            });

            it('createTableAsync', async () => {
                await expect(
                    base.createTableAsync('foo', [{name: 'x', type: FieldType.SINGLE_LINE_TEXT}]),
                ).rejects.toThrow(errorMessage);
            });
        });

        describe('globalConfig', () => {
            it('get', () => {
                expect(() => {
                    globalConfig.get('some key');
                }).toThrowError(errorMessage);
            });

            it('checkPermissionsForSet', () => {
                expect(() => {
                    globalConfig.checkPermissionsForSet();
                }).toThrowError(errorMessage);
            });

            it('setAsync', async () => {
                await expect(globalConfig.setAsync('some key', 'value')).rejects.toThrowError(
                    errorMessage,
                );
            });

            it('setPathsAsync', async () => {
                await expect(
                    globalConfig.setPathsAsync([{path: ['some key'], value: 'value'}]),
                ).rejects.toThrowError(errorMessage);
            });
        });

        it('reload', () => {
            reload();

            expect(warnSpy).toHaveBeenCalledTimes(1);
        });

        describe('settingsButton', () => {
            it('show', () => {
                settingsButton.show();

                expect(warnSpy).toHaveBeenCalledTimes(1);
            });

            it('hide', () => {
                settingsButton.hide();

                expect(warnSpy).toHaveBeenCalledTimes(1);
            });
        });

        it('undoRedo', () => {
            undoRedo.mode = 'auto';

            expect(warnSpy).toHaveBeenCalledTimes(1);
        });

        describe('viewport', () => {
            it('addMaxFullscreenSize', () => {
                expect(() => {
                    viewport.addMaxFullscreenSize({width: 1, height: 1});
                }).toThrowError(errorMessage);
            });

            it('addMinSize', () => {
                expect(() => {
                    viewport.addMinSize({width: 1, height: 1});
                }).toThrowError(errorMessage);
            });

            it('enterFullscreenIfPossible', () => {
                expect(() => {
                    viewport.enterFullscreenIfPossible();
                }).toThrowError(errorMessage);
            });

            it('exitFullscreen', () => {
                expect(() => {
                    viewport.exitFullscreen();
                }).toThrowError(errorMessage);
            });
        });
    });

    describe('@airtable/blocks/unstable_private_utils', () => {
        describe('blockStats', () => {
            it('increment', () => {
                blockStats.increment('foo');

                expect(warnSpy).toHaveBeenCalledTimes(1);
            });

            it('incrementBy', () => {
                blockStats.incrementBy('foo', 1);

                expect(warnSpy).toHaveBeenCalledTimes(1);
            });

            it('decrement', () => {
                blockStats.decrement('bar');

                expect(warnSpy).toHaveBeenCalledTimes(1);
            });

            it('decrementBy', () => {
                blockStats.decrementBy('bar', 1);

                expect(warnSpy).toHaveBeenCalledTimes(1);
            });

            it('gauge', () => {
                blockStats.gauge('foo', 1);

                expect(warnSpy).toHaveBeenCalledTimes(1);
            });

            it('histogram', () => {
                blockStats.histogram('foo', 1);

                expect(warnSpy).toHaveBeenCalledTimes(1);
            });

            it('distribution', () => {
                blockStats.distribution('foo', 1);

                expect(warnSpy).toHaveBeenCalledTimes(1);
            });

            it('timing', () => {
                blockStats.timing('foo', 1);

                expect(warnSpy).toHaveBeenCalledTimes(1);
            });

            it('timingWithSum', () => {
                blockStats.timingWithSum('foo', 1);

                expect(warnSpy).toHaveBeenCalledTimes(2);
            });
        });

        it('trackEvent', () => {
            trackEvent('foobar');

            expect(warnSpy).toHaveBeenCalledTimes(1);
        });
    });
});
