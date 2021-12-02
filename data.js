yld = document.querySelectorAll('.data-row-value')[3].textContent;
yld = yld.slice(0,-1);
staked = document.querySelectorAll('.data-row-value')[1].textContent;
staked = staked.split(' ')[0];
res = [yld, staked];
res
