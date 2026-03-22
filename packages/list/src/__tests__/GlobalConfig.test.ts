import { describe, it, expect, vi, afterEach} from 'vitest';
import { GlobalConfig } from '@/components/GlobalConfig';
import {cloneDeep} from 'lodash-es';
import {mountEditList, mountViewList} from '@/__tests__/mountComponent.ts';

const defaultGlobalConfig = cloneDeep(GlobalConfig)

describe('GlobalConfig', () => {
    afterEach(() => {
        Object.assign(GlobalConfig, defaultGlobalConfig);
    })

    describe('ignoreClassNames', () => {
        it('should have default empty array', () => {
            expect(GlobalConfig.ignoreClassNames).toEqual([]);
        });

        it('should be modifiable', () => {
            GlobalConfig.ignoreClassNames = ['btn', 'link'];
            expect(GlobalConfig.ignoreClassNames).toEqual(['btn', 'link']);
        });
    });

    describe('pasteFailedHandler', () => {
        it('should log error to console', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const error = new Error('Test paste error');

            GlobalConfig.pasteFailedHandler?.(error);
            
            expect(consoleSpy).toHaveBeenCalledWith('List paste failed.', error);
            consoleSpy.mockRestore();
        });

        it('should handle validation error map', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const errorMap = new Map([[0, [new Error('Invalid field')]]]);
            
            GlobalConfig.pasteFailedHandler?.(errorMap);
            
            expect(consoleSpy).toHaveBeenCalledWith('List paste failed.', errorMap);
            consoleSpy.mockRestore();
        });
    });

    describe('EditList integration', () => {
        it('should use GlobalConfig.ignoreClassNames as default', () => {
            GlobalConfig.ignoreClassNames = ['btn', 'link'];

            const wrapper = mountEditList({});

            expect(wrapper.props().ignoreClassNames).toStrictEqual(GlobalConfig.ignoreClassNames);
        });
    });

    describe('ViewList integration', () => {
        it('should use GlobalConfig.ignoreClassNames as default', () => {
            GlobalConfig.ignoreClassNames = ['btn', 'link'];

            const wrapper = mountViewList({});

            expect(wrapper.props().ignoreClassNames).toStrictEqual(GlobalConfig.ignoreClassNames);
        });
    });
});
