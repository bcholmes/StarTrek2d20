import * as React from 'react';
import {character} from '../common/character';
import { CharacterType } from '../common/characterType';
import {Window} from '../common/window';
import {TracksHelper} from '../helpers/tracks';
import {SkillsHelper, Skill} from '../helpers/skills';
import {Button} from './button';
import { Track } from '../helpers/trackEnum';

interface ITrackSelectionProperties {
    onSelection: (track: Track) => void;
    onCancel: () => void;
    enlisted?: boolean;
}

