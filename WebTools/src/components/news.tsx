import React from 'react';
import Button from 'react-bootstrap/Button';
import { ModalBox as Modal } from './modal';
import { useTranslation } from 'react-i18next';

interface INewsProperties {
  showModal: boolean;
  onClose: () => void;
}

export const News: React.FC<INewsProperties> = ({ showModal, onClose }) => {
  const { t } = useTranslation();

  return (
    <Modal
      size="lg"
      show={showModal}
      onClose={() => onClose()}
      header="What's New?"
    >
      <b>v1.260904</b>
      <ul>
        <li>Minor token changes.</li>
        <li>More Polish translations.</li>
      </ul>
      <b>v1.260823</b>
      <ul>
        <li>Minor token improvements.</li>
      </ul>
      <b>v1.260822</b>
      <ul>
        <li>Small bug fixes and minor improvements.</li>
      </ul>
      <b>v1.260813</b>
      <ul>
        <li>Minor fixes.</li>
      </ul>
      <b>v1.260808</b>
      <ul>
        <li>More of the same. But more.</li>
      </ul>
      <b>v1.260803</b>
      <ul>
        <li>More of the same.</li>
      </ul>
      <b>v1.260801</b>
      <ul>
        <li>More fixes and token tweaks.</li>
      </ul>
      <b>v1.260731</b>
      <ul>
        <li>
          A number of bug fixes and improvements contributed by Kevin C. Baird.
        </li>
        <li>More minor token tweaks.</li>
      </ul>
      <b>v1.260726</b>
      <ul>
        <li>Still more token tweaks.</li>
      </ul>
      <b>v1.260725</b>
      <ul>
        <li>More minor token tweaks.</li>
        <li>More Polish translations.</li>
      </ul>
      <b>v1.260719</b>
      <ul>
        <li>Some minor token tweaks.</li>
        <li>Nodify reputation.</li>
      </ul>
      <b>v1.260718</b>
      <ul>
        <li>Some more improvements to characters with tokens attached.</li>
        <li>Minor font fix.</li>
      </ul>
      <b>v1.260716</b>
      <ul>
        <li>More Polish translations.</li>
      </ul>
      <b>v1.260713</b>
      <ul>
        <li>Bug fixes.</li>
      </ul>
      <b>v1.260712</b>
      <ul>
        <li>Create a mechanism to associate tokens with characters.</li>
        <li>A couple of improvement requests.</li>
      </ul>
      <b>v1.260705</b>
      <ul>
        <li>Even moar bug fixes!</li>
      </ul>
      <b>v1.260704</b>
      <ul>
        <li>Bug fixes.</li>
      </ul>
      <b>v1.260627</b>
      <ul>
        <li>More Polish text.</li>
        <li>Minor bug fixes.</li>
      </ul>
      <b>v1.260625</b>
      <ul>
        <li>Initial Polish support.</li>
        <li>A small bug fix.</li>
      </ul>
      <b>v1.260624</b>
      <ul>
        <li>Bug fixes.</li>
        <li>Initial version of a general edit ability.</li>
      </ul>
      <b>v1.260620</b>
      <ul>
        <li>Various bug fixes.</li>
        <li>A few new spaceframe appearances.</li>
        <li>Minor tweaks to tokens.</li>
      </ul>
      <b>v1.260612</b>
      <ul>
        <li>
          Numerous token tweaks and bug fixes. A variety of typo corrections,
          courtesy of Felderburg.
        </li>
        <li>
          A few <cite>Player's Guide</cite> / <cite>GM's Guide</cite> version 2
          updates.
        </li>
      </ul>
      <b>v1.260531</b>
      <ul>
        <li>Minor updates.</li>
      </ul>
      <b>v1.260523</b>
      <ul>
        <li>Bug fixes and more token tweaks.</li>
      </ul>
      <b>v1.260518</b>
      <ul>
        <li>More minor token changes.</li>
      </ul>
      <b>v1.260516</b>
      <ul>
        <li>Minor improvements to tokens.</li>
      </ul>
      <b>v1.260515</b>
      <ul>
        <li>A handful of minor updates and bug fixes.</li>
        <li>
          Added a 32nd-century uniform, with important commbadge contributions
          from Felderburg.
        </li>
      </ul>
      <b>v1.260508</b>
      <ul>
        <li>
          Support for the 2nd edition updates for the{' '}
          <cite>Gamma Quadrant</cite> and
          <cite>Delta Quadrant</cite> sourcebooks.
        </li>
      </ul>
      <b>v1.260507</b>
      <ul>
        <li>Tweaks to the Talent list.</li>
        <li>More work on spaceframe appearances and other bug fixes.</li>
      </ul>
      <b>v1.260502</b>
      <ul>
        <li>
          At Modiphius/Paramount's request, I've removed key text that
          originated in the <cite>Species Sourcebook</cite>.
        </li>
        <li>Other minor improvements.</li>
      </ul>
      <b>v1.260429</b>
      <ul>
        <li>Small bug fixes.</li>
      </ul>
      <b>v1.260425</b>
      <ul>
        <li>
          A few straggling updates from the <cite>Species Sourcebook</cite>.
        </li>
        <li>Other minor updates.</li>
      </ul>
      <b>v1.260423</b>
      <ul>
        <li>
          Support for most of the new material for the{' '}
          <cite>Species Sourcebook</cite>. There are certain features &mdash;
          like additional rules around custom species &mdash; that haven't yet
          been implemented. They'll come soon enough.
        </li>
        <li>
          There may be certain rules that still need to be implemented (such as
          species abilities that change things like Protection). I'll work on
          cleaning that up, soon.
        </li>
      </ul>
      <b>v1.260412</b>
      <ul>
        <li>More minor improvements and fixes.</li>
      </ul>
      <b>v1.260411</b>
      <ul>
        <li>Minor improvements and fixes.</li>
      </ul>
      <b>v1.260410</b>
      <ul>
        <li>Tweaks to the handling of custom spaceframes.</li>
      </ul>
      <b>v1.260331</b>
      <ul>
        <li>Additional minor improvements.</li>
      </ul>
      <b>v1.260327</b>
      <ul>
        <li>
          Minor improvements. Prep for the new <cite>Species</cite> book.
        </li>
      </ul>
      <b>v1.260320</b>
      <ul>
        <li>Additional bug fixes.</li>
      </ul>
      <b>v1.260315</b>
      <ul>
        <li>Additional enhancements to station creation.</li>
      </ul>
      <b>v1.260312</b>
      <ul>
        <li>Bug fixes.</li>
      </ul>
      <b>v1.260311</b>
      <ul>
        <li>A few improvements/fixes to station creation.</li>
        <li>
          I neglected to mention that I also threw in 2nd Edition support for
          the
          <cite>Alpha</cite> and <cite>Beta Quadrant</cite> 2nd Edition updates.
        </li>
      </ul>
      <b>v1.260309</b>
      <ul>
        <li>Station creation!</li>
        <li>More bug fixes.</li>
      </ul>
      <b>v1.260217</b>
      <ul>
        <li>
          Some initial work supporting the{' '}
          <cite>23rd Centry Campaign Guide</cite>.
        </li>
        <li>Some bug fixes.</li>
      </ul>

      <div className="text-center">
        <Button size="sm" onClick={() => onClose()}>
          {t('Common.button.ok')}
        </Button>
      </div>
    </Modal>
  );
};
